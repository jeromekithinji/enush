const CONTACT_GROUPS: Record<string, string> = {
	hr: 'HR contact',
	finance: 'Finance/Payroll contact',
	other: 'Other contact',
	additional: 'Additional contact',
}

const FIELD_LABELS: Record<string, string> = {
	registeredName: 'Registered company name',
	tradingName: 'Trading name',
	registrationNumber: 'Registration/incorporation number',
	kraPin: 'KRA PIN',
	dateIncorporated: 'Date incorporated',
	yearsInOperation: 'Years in operation',
	industry: 'Industry/sector',
	natureOfBusiness: 'Nature of business',
	legalStructure: 'Legal structure',
	legalStructureOther: 'Legal structure description',
	physicalAddress: 'Physical address',
	buildingRoad: 'Building/road',
	cityTown: 'City/town',
	county: 'County',
	postalAddress: 'Postal address',
	postalCode: 'Postal code',
	mainTelephone: 'Main telephone',
	generalEmail: 'General company email',
	website: 'Website',
	escalationName: 'Senior escalation contact',
	escalationEmail: 'Escalation email',
	escalationTelephone: 'Escalation telephone',
	managersCount: 'Managers/senior management (number)',
	managersPct: 'Managers/senior management (%)',
	nonManagersCount: 'Non-managers/professional staff (number)',
	nonManagersPct: 'Non-managers/professional staff (%)',
	subordinateCount: 'Subordinate/support staff (number)',
	subordinatePct: 'Subordinate/support staff (%)',
	totalStaff: 'Total staff complement',
	permanent: 'Permanent employees',
	fixedTerm: 'Fixed-term contract employees',
	consultants: 'Consultants/casuals',
	eligible: 'Employees eligible for check-off',
	minServicePeriod: 'Minimum service period for eligibility',
	bands: 'Salary bands',
	paymentFrequency: 'Payment frequency',
	paymentFrequencyOther: 'Payment frequency description',
	salaryPaymentDate: 'Normal salary payment date',
	compensationTypes: 'Compensation types',
	compensationOther: 'Other compensation',
	averageMonthlyPayroll: 'Average monthly gross payroll',
	hasPayrollSystem: 'Payroll system',
	payrollProvider: 'Payroll system/provider',
	canGenerateSchedules: 'Deduction schedule capability',
	deductionCutoffDate: 'Proposed monthly deduction cut-off date',
	remittanceDate: 'Proposed remittance date to Enusha',
	turnoverRate: 'Annual staff exit/turnover rate',
	exitsLast12: 'Exits in the last 12 months',
	redundanciesLast24: 'Redundancies in the last 24 months',
	plannedRestructuring: 'Planned restructuring or redundancy',
	restructuringExplanation: 'Restructuring explanation',
	delayedSalaries: 'Delayed salary payments',
	delayedExplanation: 'Delayed salary explanation',
	requestedProducts: 'Requested products',
	initialApplicants: 'Expected number of initial applicants',
	estimatedMonthlyValue: 'Estimated monthly check-off value',
	existingLenders: 'Existing staff lenders or check-off providers',
	consentProcess: 'Employee consent process',
	exitNotificationTimeline: 'Exit notification timeline to Enusha',
	legalName: 'Full legal name for the MOU',
	noticesAddress: 'Registered office/address for notices',
	noticesEmail: 'Official email for MOU notices',
	commencementDate: 'Proposed commencement date',
	term: 'Proposed MOU term',
	specialClauses: 'Special requirements or clauses',
	signatories: 'Authorised signatories',
	fullName: 'Full name',
	jobTitle: 'Job title',
	email: 'Email address',
	mobile: 'Mobile number',
	officeTelephone: 'Office telephone',
	telephone: 'Telephone',
	signingAuthority: 'Signing authority',
	date: 'Date',
	accurate: 'Declaration acceptance',
	authority: 'Authority to submit',
	privacy: 'Privacy Notice consent',
	range: 'Gross monthly salary range',
	employees: 'Number of employees',
	notes: 'Notes',
	hr: 'HR contacts',
	finance: 'Finance/Payroll contacts',
}

export function describeFieldPath (path: string) {
	const contactMatch = path.match(
		/^contacts\.(hr|finance|other|additional)\.(\d+)\.(.+)$/,
	)
	if (contactMatch) {
		const [, group, index, field] = contactMatch
		const groupLabel = CONTACT_GROUPS[group] ?? 'Contact'
		const fieldLabel = FIELD_LABELS[field] ?? field
		return `${groupLabel} ${Number(index) + 1}: ${fieldLabel}`
	}

	const signatoryMatch = path.match(/^mou\.signatories\.(\d+)\.(.+)$/)
	if (signatoryMatch) {
		const [, index, field] = signatoryMatch
		return `Signatory ${Number(index) + 1}: ${FIELD_LABELS[field] ?? field}`
	}

	const bandMatch = path.match(/^payroll\.bands\.(\d+)\.(.+)$/)
	if (bandMatch) {
		const [, index, field] = bandMatch
		return `Salary band ${Number(index) + 1}: ${FIELD_LABELS[field] ?? field}`
	}

	const leaf = path.split('.').at(-1) ?? path
	return FIELD_LABELS[leaf] ?? path
}

export function fieldAnchorId (path: string) {
	return path.replaceAll('.', '-')
}
