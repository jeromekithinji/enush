import {
	ACCEPTED_FILE_LABEL,
	MAX_FILE_BYTES,
	MAX_FILE_LABEL,
} from '@/lib/onboard/constants'

export function isAcceptedFileName (name: string) {
	const lower = name.toLowerCase()
	return (
		lower.endsWith('.pdf') ||
		lower.endsWith('.doc') ||
		lower.endsWith('.docx') ||
		lower.endsWith('.xls') ||
		lower.endsWith('.xlsx') ||
		lower.endsWith('.jpg') ||
		lower.endsWith('.jpeg') ||
		lower.endsWith('.png')
	)
}

export function isAcceptedFile (file: File) {
	return isAcceptedFileName(file.name)
}

export function validateUpload (file: { name: string, size: number }) {
	if (file.size > MAX_FILE_BYTES) {
		return `File exceeds the ${MAX_FILE_LABEL} limit`
	}
	if (!isAcceptedFileName(file.name)) {
		return `File type is not accepted. Use ${ACCEPTED_FILE_LABEL}.`
	}
	return null
}

export function sanitizeFileName (name: string) {
	return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 180)
}
