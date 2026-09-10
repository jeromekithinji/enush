export const ONBOARD_STEPS = [
	{ id: 'company', label: 'Company Details' },
	{ id: 'address', label: 'Address & Contact' },
	{ id: 'contacts', label: 'Authorised Contacts' },
	{ id: 'workforce', label: 'Workforce Profile' },
	{ id: 'payroll', label: 'Salary & Payroll' },
	{ id: 'stability', label: 'Staff Stability' },
	{ id: 'mou', label: 'MOU Information' },
	{ id: 'documents', label: 'Documents' },
	{ id: 'declaration', label: 'Declaration' },
] as const

export const LEGAL_STRUCTURES = [
	'Limited company',
	'Partnership',
	'NGO/NPO',
	'Public institution',
	'Other',
] as const

export const PAYMENT_FREQUENCIES = [
	'Monthly',
	'Fortnightly',
	'Weekly',
	'Other',
] as const

export const COMPENSATION_TYPES = [
	'Full salary',
	'Fixed-term contracts',
	'Consultants',
	'Casuals',
	'Other',
] as const

export const TURNOVER_RATES = [
	'1%–10%',
	'10%–20%',
	'21% and above',
	'Not available',
] as const

export const REQUESTED_PRODUCTS = [
	'Salary advance',
	'Emergency loan',
	'School fees',
	'Professional development',
	'Wellness',
	'Home and lifestyle',
	'Insurance premium finance',
] as const

export const MAX_FILE_BYTES = 10 * 1024 * 1024
export const MAX_FILE_LABEL = '10 MB'
export const ACCEPTED_FILE_EXTENSIONS = [
	'.pdf',
	'.doc',
	'.docx',
	'.xls',
	'.xlsx',
	'.jpg',
	'.jpeg',
	'.png',
] as const
export const ACCEPTED_MIME_TYPES = [
	'application/pdf',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/vnd.ms-excel',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	'image/jpeg',
	'image/png',
] as const
export const ACCEPTED_FILE_LABEL = 'PDF, DOC, DOCX, XLS, XLSX, JPG, PNG'

export interface DocumentType {
	id: string
	label: string
	required: boolean
}

export const DOCUMENT_TYPES: DocumentType[] = [
	{
		id: 'certificate-of-incorporation',
		label: 'Certificate of incorporation/registration',
		required: true,
	},
	{
		id: 'kra-pin-certificate',
		label: 'KRA PIN certificate',
		required: true,
	},
	{
		id: 'cr12',
		label: 'Current CR12 or equivalent ownership/directorship record',
		required: true,
	},
	{
		id: 'company-profile',
		label: 'Company profile',
		required: false,
	},
	{
		id: 'business-permit',
		label: 'Current business permit or sector licence',
		required: false,
	},
	{
		id: 'audited-financials',
		label: 'Latest audited financial statements',
		required: false,
	},
	{
		id: 'management-accounts',
		label: 'Latest management accounts',
		required: false,
	},
	{
		id: 'bank-statements',
		label: 'Latest three months’ bank statements',
		required: false,
	},
	{
		id: 'payroll-summary',
		label: 'Sample payroll summary, anonymised if required',
		required: false,
	},
	{
		id: 'headcount-report',
		label: 'Employee headcount report',
		required: false,
	},
	{
		id: 'payroll-calendar',
		label: 'Payroll calendar',
		required: false,
	},
	{
		id: 'signatory-ids',
		label: 'Authorised signatories’ ID copies',
		required: true,
	},
	{
		id: 'board-resolution',
		label: 'Board resolution or authority to enter the MOU',
		required: false,
	},
	{
		id: 'other-documents',
		label: 'Other supporting documents',
		required: false,
	},
]

export const emptyContact = {
	fullName: '',
	jobTitle: '',
	email: '',
	mobile: '',
	officeTelephone: '',
}

export const emptySalaryBand = {
	range: '',
	employees: '',
	notes: '',
}

export const emptySignatory = {
	fullName: '',
	jobTitle: '',
	email: '',
	telephone: '',
	signingAuthority: '',
}
