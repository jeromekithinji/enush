import { randomBytes } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { DOCUMENT_TYPES } from '@/lib/onboard/constants'
import { notifyOnboardingSubmitted } from '@/lib/email'
import { sanitizeFileName, validateUpload } from '@/lib/onboard/files'
import {
	DuplicateOnboardingError,
	persistOnboardingSubmission,
	type StoredOnboardingDocument,
} from '@/lib/onboard/persist'
import { onboardFormSchema } from '@/lib/onboard/schema'

export const runtime = 'nodejs'
export const maxDuration = 60

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

function jsonError (
	status: number,
	code: string,
	message: string,
	extra?: Record<string, unknown>,
) {
	return Response.json({ code, message, ...extra }, { status })
}

export async function POST (request: Request) {
	let formData: FormData
	try {
		formData = await request.formData()
	} catch {
		return jsonError(
			400,
			'backend',
			'The submission could not be read. Your answers have been kept.',
		)
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

	const reference = createReference()
	const submittedAt = new Date().toISOString()
	const root = storageRoot()
	const submissionDir = path.join(root, reference)
	const documentsDir = path.join(submissionDir, 'documents')
	await mkdir(documentsDir, { recursive: true })

	const storedDocuments: StoredOnboardingDocument[] = []
	for (const item of files) {
		const safeName = sanitizeFileName(item.file.name)
		const fileName = `${item.id}-${safeName}`
		const filePath = path.join(documentsDir, fileName)
		const bytes = Buffer.from(await item.file.arrayBuffer())
		await writeFile(filePath, bytes)
		storedDocuments.push({
			id: item.id,
			name: item.file.name,
			size: item.file.size,
			type: item.file.type,
			storageUrl: path.relative(process.cwd(), filePath),
		})
	}

	const record = {
		reference,
		submittedAt,
		payload: parsed.data,
		documents: storedDocuments.map((document) => ({
			id: document.id,
			name: document.name,
			size: document.size,
			type: document.type,
		})),
		malwareScan: 'not-configured',
	}
	const payloadPath = path.join(submissionDir, 'submission.json')
	await writeFile(payloadPath, JSON.stringify(record, null, 2))
	const payloadUrl = path.relative(process.cwd(), payloadPath)

	try {
		await persistOnboardingSubmission({
			record,
			documents: storedDocuments,
			payloadUrl,
		})
	} catch (error) {
		if (error instanceof DuplicateOnboardingError) {
			return jsonError(409, 'duplicate', error.message, {
				reference: error.reference,
			})
		}

		console.error('Failed to persist onboarding submission', error)
		return jsonError(
			500,
			'backend',
			'The submission was received but could not be saved. Please try again or contact Enusha.',
		)
	}

	let emailQueued = false
	try {
		emailQueued = await notifyOnboardingSubmitted({
			reference,
			submittedAt,
			payload: parsed.data,
			documentNames: storedDocuments.map((document) => document.name),
		})
	} catch {
		emailQueued = false
	}

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
					documentCount: storedDocuments.length,
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
