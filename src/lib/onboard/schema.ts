import { z } from 'zod'

const requiredText = z.string().trim().min(1, 'Required')
const optionalText = z.string().trim()
const optionalEmail = z
	.string()
	.trim()
	.refine((value) => value === '' || z.string().email().safeParse(value).success, 'Enter a valid email')
const requiredEmail = z.string().trim().email('Enter a valid email')
const wholeNumber = z
	.string()
	.trim()
	.refine(
		(value) => value === '' || /^\d+$/.test(value),
		'Must be zero or a positive whole number',
	)
const requiredWholeNumber = z
	.string()
	.trim()
	.refine((value) => /^\d+$/.test(value), 'Must be zero or a positive whole number')
const percentage = z
	.string()
	.trim()
	.refine((value) => {
		if (value === '') {
			return true
		}
		if (!/^\d+(\.\d+)?$/.test(value)) {
			return false
		}
		const numeric = Number(value)
		return numeric >= 0 && numeric <= 100
	}, 'Must be between 0 and 100')

export const contactSchema = z.object({
	fullName: requiredText,
	jobTitle: requiredText,
	email: requiredEmail,
	mobile: requiredText,
	officeTelephone: optionalText,
})

export const optionalContactSchema = z.object({
	fullName: optionalText,
	jobTitle: optionalText,
	email: optionalEmail,
	mobile: optionalText,
	officeTelephone: optionalText,
}).superRefine((contact, ctx) => {
	const hasAny = [
		contact.fullName,
		contact.jobTitle,
		contact.email,
		contact.mobile,
		contact.officeTelephone,
	].some((value) => value.length > 0)
	if (!hasAny) {
		return
	}
	const parsed = contactSchema.safeParse(contact)
	if (!parsed.success) {
		for (const issue of parsed.error.issues) {
			ctx.addIssue({
				code: 'custom',
				path: issue.path,
				message: issue.message,
			})
		}
	}
})

export const companySchema = z.object({
	registeredName: requiredText,
	tradingName: optionalText,
	registrationNumber: requiredText,
	kraPin: requiredText,
	dateIncorporated: optionalText,
	yearsInOperation: wholeNumber,
	industry: requiredText,
	natureOfBusiness: optionalText,
	legalStructure: requiredText,
	legalStructureOther: optionalText,
}).superRefine((data, ctx) => {
	if (data.legalStructure === 'Other' && data.legalStructureOther.length === 0) {
		ctx.addIssue({
			code: 'custom',
			path: ['legalStructureOther'],
			message: 'Required',
		})
	}
})

export const addressSchema = z.object({
	physicalAddress: requiredText,
	buildingRoad: optionalText,
	cityTown: requiredText,
	county: requiredText,
	postalAddress: optionalText,
	postalCode: optionalText,
	mainTelephone: requiredText,
	generalEmail: requiredEmail,
	website: optionalText,
})

export const contactsSchema = z.object({
	hr: z.array(contactSchema).min(1, 'Provide at least one HR contact'),
	finance: z.array(contactSchema).min(1, 'Provide at least one Finance or Payroll contact'),
	other: z.array(optionalContactSchema),
	additional: z.array(optionalContactSchema),
	escalationName: optionalText,
	escalationEmail: optionalEmail,
	escalationTelephone: optionalText,
})

export const workforceSchema = z.object({
	managersCount: wholeNumber,
	managersPct: percentage,
	nonManagersCount: wholeNumber,
	nonManagersPct: percentage,
	subordinateCount: wholeNumber,
	subordinatePct: percentage,
	totalStaff: requiredWholeNumber,
	permanent: wholeNumber,
	fixedTerm: wholeNumber,
	consultants: wholeNumber,
	eligible: wholeNumber,
	minServicePeriod: optionalText,
})

export const salaryBandSchema = z.object({
	range: optionalText,
	employees: wholeNumber,
	notes: optionalText,
})

export const payrollSchema = z.object({
	bands: z.array(salaryBandSchema).min(1, 'Add at least one salary band'),
	paymentFrequency: requiredText,
	paymentFrequencyOther: optionalText,
	salaryPaymentDate: optionalText,
	compensationTypes: z.array(z.string()),
	compensationOther: optionalText,
	averageMonthlyPayroll: optionalText,
	hasPayrollSystem: z.enum(['yes', 'no', '']),
	payrollProvider: optionalText,
	canGenerateSchedules: z.enum(['yes', 'no', '']),
	deductionCutoffDate: optionalText,
	remittanceDate: optionalText,
}).superRefine((data, ctx) => {
	if (data.paymentFrequency === 'Other' && data.paymentFrequencyOther.length === 0) {
		ctx.addIssue({
			code: 'custom',
			path: ['paymentFrequencyOther'],
			message: 'Required',
		})
	}
	if (data.hasPayrollSystem === '') {
		ctx.addIssue({
			code: 'custom',
			path: ['hasPayrollSystem'],
			message: 'Required',
		})
	}
	if (data.hasPayrollSystem === 'yes' && data.payrollProvider.length === 0) {
		ctx.addIssue({
			code: 'custom',
			path: ['payrollProvider'],
			message: 'Required',
		})
	}
	if (data.compensationTypes.includes('Other') && data.compensationOther.length === 0) {
		ctx.addIssue({
			code: 'custom',
			path: ['compensationOther'],
			message: 'Required',
		})
	}
})

export const stabilitySchema = z.object({
	turnoverRate: requiredText,
	exitsLast12: wholeNumber,
	redundanciesLast24: wholeNumber,
	plannedRestructuring: z.enum(['yes', 'no', '']),
	restructuringExplanation: optionalText,
	delayedSalaries: z.enum(['yes', 'no', '']),
	delayedExplanation: optionalText,
	requestedProducts: z.array(z.string()).min(1, 'Select at least one product'),
	initialApplicants: wholeNumber,
	estimatedMonthlyValue: optionalText,
	existingLenders: optionalText,
	consentProcess: requiredText,
	exitNotificationTimeline: requiredText,
}).superRefine((data, ctx) => {
	if (data.plannedRestructuring === '') {
		ctx.addIssue({
			code: 'custom',
			path: ['plannedRestructuring'],
			message: 'Required',
		})
	}
	if (data.plannedRestructuring === 'yes' && data.restructuringExplanation.length === 0) {
		ctx.addIssue({
			code: 'custom',
			path: ['restructuringExplanation'],
			message: 'Required',
		})
	}
	if (data.delayedSalaries === '') {
		ctx.addIssue({
			code: 'custom',
			path: ['delayedSalaries'],
			message: 'Required',
		})
	}
	if (data.delayedSalaries === 'yes' && data.delayedExplanation.length === 0) {
		ctx.addIssue({
			code: 'custom',
			path: ['delayedExplanation'],
			message: 'Required',
		})
	}
})

export const signatorySchema = z.object({
	fullName: requiredText,
	jobTitle: requiredText,
	email: requiredEmail,
	telephone: requiredText,
	signingAuthority: requiredText,
})

export const mouSchema = z.object({
	legalName: requiredText,
	noticesAddress: requiredText,
	noticesEmail: requiredEmail,
	commencementDate: optionalText,
	term: optionalText,
	specialClauses: optionalText,
	signatories: z.array(signatorySchema).min(1, 'Add at least one authorised signatory'),
})

export const declarationSchema = z.object({
	fullName: requiredText,
	jobTitle: requiredText,
	email: requiredEmail,
	date: requiredText,
	accurate: z.boolean().refine((value) => value, 'Required'),
	authority: z.boolean().refine((value) => value, 'Required'),
	privacy: z.boolean().refine((value) => value, 'Required'),
})

export const onboardFormSchema = z.object({
	company: companySchema,
	address: addressSchema,
	contacts: contactsSchema,
	workforce: workforceSchema,
	payroll: payrollSchema,
	stability: stabilitySchema,
	mou: mouSchema,
	declaration: declarationSchema,
})

export type OnboardFormValues = z.infer<typeof onboardFormSchema>

export const defaultOnboardValues: OnboardFormValues = {
	company: {
		registeredName: '',
		tradingName: '',
		registrationNumber: '',
		kraPin: '',
		dateIncorporated: '',
		yearsInOperation: '',
		industry: '',
		natureOfBusiness: '',
		legalStructure: '',
		legalStructureOther: '',
	},
	address: {
		physicalAddress: '',
		buildingRoad: '',
		cityTown: '',
		county: '',
		postalAddress: '',
		postalCode: '',
		mainTelephone: '',
		generalEmail: '',
		website: '',
	},
	contacts: {
		hr: [{ fullName: '', jobTitle: '', email: '', mobile: '', officeTelephone: '' }],
		finance: [{ fullName: '', jobTitle: '', email: '', mobile: '', officeTelephone: '' }],
		other: [],
		additional: [],
		escalationName: '',
		escalationEmail: '',
		escalationTelephone: '',
	},
	workforce: {
		managersCount: '',
		managersPct: '',
		nonManagersCount: '',
		nonManagersPct: '',
		subordinateCount: '',
		subordinatePct: '',
		totalStaff: '',
		permanent: '',
		fixedTerm: '',
		consultants: '',
		eligible: '',
		minServicePeriod: '',
	},
	payroll: {
		bands: [{ range: '', employees: '', notes: '' }],
		paymentFrequency: '',
		paymentFrequencyOther: '',
		salaryPaymentDate: '',
		compensationTypes: [],
		compensationOther: '',
		averageMonthlyPayroll: '',
		hasPayrollSystem: '',
		payrollProvider: '',
		canGenerateSchedules: '',
		deductionCutoffDate: '',
		remittanceDate: '',
	},
	stability: {
		turnoverRate: '',
		exitsLast12: '',
		redundanciesLast24: '',
		plannedRestructuring: '',
		restructuringExplanation: '',
		delayedSalaries: '',
		delayedExplanation: '',
		requestedProducts: [],
		initialApplicants: '',
		estimatedMonthlyValue: '',
		existingLenders: '',
		consentProcess: '',
		exitNotificationTimeline: '',
	},
	mou: {
		legalName: '',
		noticesAddress: '',
		noticesEmail: '',
		commencementDate: '',
		term: '',
		specialClauses: '',
		signatories: [
			{
				fullName: '',
				jobTitle: '',
				email: '',
				telephone: '',
				signingAuthority: '',
			},
		],
	},
	declaration: {
		fullName: '',
		jobTitle: '',
		email: '',
		date: '',
		accurate: false,
		authority: false,
		privacy: false,
	},
}

export function getWorkforceMismatch (workforce: OnboardFormValues['workforce']): string | null {
	const parts = [
		workforce.managersCount,
		workforce.nonManagersCount,
		workforce.subordinateCount,
	]
	if (parts.some((value) => value.trim() === '') || workforce.totalStaff.trim() === '') {
		return null
	}
	const categoryTotal = parts.reduce((sum, value) => sum + Number(value), 0)
	const total = Number(workforce.totalStaff)
	if (categoryTotal === total) {
		return null
	}
	return `The employee category counts add up to ${categoryTotal}, which does not match the total staff complement of ${total}. This is a warning only — your figures have not been changed.`
}

export const stepSchemas = [
	companySchema,
	addressSchema,
	contactsSchema,
	workforceSchema,
	payrollSchema,
	stabilitySchema,
	mouSchema,
	null,
	declarationSchema,
] as const
