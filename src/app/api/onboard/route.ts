import { randomBytes } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { DOCUMENT_TYPES } from '@/lib/onboard/constants'
import { sanitizeFileName, validateUpload } from '@/lib/onboard/files'
import { onboardFormSchema, type OnboardFormValues } from '@/lib/onboard/schema'

export const runtime = 'nodejs'
export const maxDuration = 60

interface StoredIndex {
	fingerprints: Record<string, string>
}

function storageRoot () {
	if (process.env.ONBOARD_STORAGE_DIR) {
		return process.env.ONBOARD_STORAGE_DIR
	}
	if (process.env.VERCEL) {
		return path.join('/tmp', 'enusha-onboard')
	}
	return path.join(process.cwd(), '.data', 'onboard')
}

function createReference () {
	const stamp = new Date().toISOString().slice(0, 10).replaceAll('-', '')
	const suffix = randomBytes(3).toString('hex').toUpperCase()
	return `ENU-${stamp}-${suffix}`
}

function fingerprint (data: OnboardFormValues) {
	return `${data.company.registrationNumber}|${data.company.kraPin}`
		.toLowerCase()
		.trim()
}

async function readIndex (root: string): Promise<StoredIndex> {
	try {
		const raw = await readFile(path.join(root, 'index.json'), 'utf8')
		const parsed = JSON.parse(raw) as StoredIndex
		return {
			fingerprints: parsed.fingerprints ?? {},
		}
	} catch {
		return { fingerprints: {} }
	}
}

async function writeIndex (root: string, index: StoredIndex) {
	await writeFile(path.join(root, 'index.json'), JSON.stringify(index, null, 2))
}

function jsonError (status: number, code: string, message: string, extra?: Record<string, unknown>) {
	return Response.json({ code, message, ...extra }, { status })
}

export async function POST (request: Request) {
	let formData: FormData
	try {
		formData = await request.formData()
	} catch {
		return jsonError(400, 'backend', 'The submission could not be read. Your answers have been kept.')
	}

	const payloadRaw = formData.get('payload')
	if (typeof payloadRaw !== 'string') {
		return jsonError(400, 'validation', 'The form payload was missing.')
	}

	let parsedJson: unknown
	try {
		parsedJson = JSON.parse(payloadRaw)
	} catch {
		return jsonError(400, 'validation', 'The form payload was not valid JSON.')
	}

	const parsed = onboardFormSchema.safeParse(parsedJson)
	if (!parsed.success) {
		return jsonError(400, 'validation', 'The submission failed validation.', {
			issues: parsed.error.issues.map((issue) => ({
				path: issue.path.join('.'),
				message: issue.message,
			})),
		})
	}

	const files: { id: string, file: File }[] = []
	for (const [key, value] of formData.entries()) {
		if (!key.startsWith('file:') || !(value instanceof File)) {
			continue
		}
		const id = key.slice(5)
		const known = DOCUMENT_TYPES.find((documentType) => documentType.id === id)
		if (!known) {
			return jsonError(400, 'upload', `Unexpected document type: ${id}`)
		}
		const uploadError = validateUpload(value)
		if (uploadError) {
			return jsonError(400, 'upload', `${known.label}: ${uploadError}`)
		}
		files.push({ id, file: value })
	}

	const missingRequired = DOCUMENT_TYPES.filter((documentType) => {
		if (!documentType.required) {
			return false
		}
		return !files.some((item) => item.id === documentType.id)
	})
	if (missingRequired.length > 0) {
		return jsonError(
			400,
			'upload',
			`Missing required document: ${missingRequired.map((item) => item.label).join(', ')}`,
		)
	}

	const root = storageRoot()
	await mkdir(root, { recursive: true })
	const index = await readIndex(root)
	const key = fingerprint(parsed.data)
	if (key !== '|' && index.fingerprints[key]) {
		return jsonError(
			409,
			'duplicate',
			`A submission for this company already exists (${index.fingerprints[key]}). Your answers have been kept. Contact Enusha if you need to update an existing application.`,
			{ reference: index.fingerprints[key] },
		)
	}

	const reference = createReference()
	const submittedAt = new Date().toISOString()
	const submissionDir = path.join(root, reference)
	await mkdir(path.join(submissionDir, 'documents'), { recursive: true })

	const storedFiles: { id: string, name: string, size: number, type: string }[] = []
	for (const item of files) {
		const safeName = sanitizeFileName(item.file.name)
		const bytes = Buffer.from(await item.file.arrayBuffer())
		await writeFile(path.join(submissionDir, 'documents', `${item.id}-${safeName}`), bytes)
		storedFiles.push({
			id: item.id,
			name: item.file.name,
			size: item.file.size,
			type: item.file.type,
		})
	}

	const record = {
		reference,
		submittedAt,
		payload: parsed.data,
		documents: storedFiles,
		malwareScan: 'not-configured',
	}
	await writeFile(
		path.join(submissionDir, 'submission.json'),
		JSON.stringify(record, null, 2),
	)

	index.fingerprints[key] = reference
	await writeIndex(root, index)

	let emailQueued = false
	if (process.env.ONBOARD_CONFIRMATION_EMAIL_URL && parsed.data.declaration.email) {
		try {
			const response = await fetch(process.env.ONBOARD_CONFIRMATION_EMAIL_URL, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					to: parsed.data.declaration.email,
					reference,
					company: parsed.data.company.registeredName,
				}),
			})
			emailQueued = response.ok
		} catch {
			emailQueued = false
		}
	}

	if (process.env.ONBOARD_TEAM_WEBHOOK_URL) {
		try {
			await fetch(process.env.ONBOARD_TEAM_WEBHOOK_URL, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					reference,
					submittedAt,
					company: parsed.data.company.registeredName,
					registrationNumber: parsed.data.company.registrationNumber,
					declarant: parsed.data.declaration.email,
					documentCount: storedFiles.length,
				}),
			})
		} catch {
			// Team notification is best-effort and must not erase a received submission.
		}
	}

	return Response.json({
		reference,
		submittedAt,
		emailQueued,
	})
}
