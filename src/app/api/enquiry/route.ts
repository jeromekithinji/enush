import { randomBytes } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { enquirySchema } from '@/lib/enquiry/schema'

export const runtime = 'nodejs'

function storageRoot () {
	if (process.env.ENQUIRY_STORAGE_DIR) {
		return process.env.ENQUIRY_STORAGE_DIR
	}
	if (process.env.VERCEL) {
		return path.join('/tmp', 'enusha-enquiries')
	}
	return path.join(process.cwd(), '.data', 'enquiries')
}

function createReference () {
	const stamp = new Date().toISOString().slice(0, 10).replaceAll('-', '')
	const suffix = randomBytes(3).toString('hex').toUpperCase()
	return `ENQ-${stamp}-${suffix}`
}

function jsonError (status: number, message: string) {
	return Response.json({ message }, { status })
}

export async function POST (request: Request) {
	let payload: unknown
	try {
		payload = await request.json()
	} catch {
		return jsonError(400, 'The request could not be read.')
	}

	const parsed = enquirySchema.safeParse(payload)
	if (!parsed.success) {
		return jsonError(400, 'Please correct the highlighted fields.')
	}

	const reference = createReference()
	const submittedAt = new Date().toISOString()
	const root = storageRoot()
	await mkdir(root, { recursive: true })
	await writeFile(
		path.join(root, `${reference}.json`),
		JSON.stringify({
			reference,
			submittedAt,
			payload: parsed.data,
		}, null, 2),
	)

	if (process.env.ENQUIRY_TEAM_WEBHOOK_URL) {
		try {
			await fetch(process.env.ENQUIRY_TEAM_WEBHOOK_URL, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					reference,
					submittedAt,
					...parsed.data,
				}),
			})
		} catch {
			// Team notification is best-effort.
		}
	}

	return Response.json({ reference, submittedAt })
}
