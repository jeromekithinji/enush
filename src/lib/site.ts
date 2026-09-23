export const COMPANY_NAME = 'Enusha Capital Ltd'
export const COMPANY_ADDRESS_LINES = [
	'Pioneer House,',
	'Kenyatta Avenue, Nairobi, Kenya',
] as const
export const COMPANY_ADDRESS = COMPANY_ADDRESS_LINES.join(' ')
export const SUPPORT_EMAIL = 'clientsupport@enusha.co.ke'
export const SUPPORT_TELEPHONE = '+254 759 385059'
export const TAGLINE = 'Loans Bila Stress'

export const legalNavItems = [
	{ href: '/privacy', label: 'Privacy Notice' },
	{ href: '/terms#terms-of-use', label: 'Terms of Use' },
	{ href: '/terms#responsible-lending', label: 'Responsible Lending' },
	{ href: '/terms#complaints', label: 'Complaints & Customer Support' },
] as const

export const lendingDisclaimer =
	'Borrowing should be based on genuine need and the ability to repay. Loan availability and approval are subject to employer participation, employee eligibility, affordability assessment, applicable policies, and final credit approval. Product terms may change, and applicants should review the applicable loan agreement before accepting an offer.'
