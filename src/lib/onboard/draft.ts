import { defaultOnboardValues, type OnboardFormValues } from '@/lib/onboard/schema'

const DRAFT_KEY = 'enusha-onboard-draft-v1'
const SUBMITTED_KEY = 'enusha-onboard-submitted-refs'

export interface OnboardDraft {
	savedAt: number
	step: number
	data: OnboardFormValues
}

export function saveOnboardDraft (draft: OnboardDraft) {
	window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
}

export function loadOnboardDraft (): OnboardDraft | null {
	const raw = window.localStorage.getItem(DRAFT_KEY)
	if (!raw) {
		return null
	}
	try {
		const parsed = JSON.parse(raw) as OnboardDraft
		if (!parsed?.data) {
			return null
		}
		return {
			savedAt: parsed.savedAt,
			step: typeof parsed.step === 'number' ? parsed.step : 0,
			data: {
				...defaultOnboardValues,
				...parsed.data,
				company: { ...defaultOnboardValues.company, ...parsed.data.company },
				address: { ...defaultOnboardValues.address, ...parsed.data.address },
				contacts: { ...defaultOnboardValues.contacts, ...parsed.data.contacts },
				workforce: { ...defaultOnboardValues.workforce, ...parsed.data.workforce },
				payroll: { ...defaultOnboardValues.payroll, ...parsed.data.payroll },
				stability: { ...defaultOnboardValues.stability, ...parsed.data.stability },
				mou: { ...defaultOnboardValues.mou, ...parsed.data.mou },
				declaration: { ...defaultOnboardValues.declaration, ...parsed.data.declaration },
			},
		}
	} catch {
		return null
	}
}

export function clearOnboardDraft () {
	window.localStorage.removeItem(DRAFT_KEY)
}

export function rememberSubmittedReference (reference: string) {
	const existing = getSubmittedReferences()
	window.localStorage.setItem(
		SUBMITTED_KEY,
		JSON.stringify([...existing, reference]),
	)
}

export function getSubmittedReferences (): string[] {
	const raw = window.localStorage.getItem(SUBMITTED_KEY)
	if (!raw) {
		return []
	}
	try {
		const parsed = JSON.parse(raw) as string[]
		return Array.isArray(parsed) ? parsed : []
	} catch {
		return []
	}
}

export function submissionFingerprint (data: OnboardFormValues) {
	return `${data.company.registrationNumber}|${data.company.kraPin}`
		.toLowerCase()
		.trim()
}
