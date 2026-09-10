export interface FaqItem {
	id: string
	question: string
	answer: string
}

export const faqs: FaqItem[] = [
	{
		id: 'payroll-check-off-loan',
		question: 'What is a payroll check-off loan?',
		answer:
			'A payroll check-off loan is a credit facility where repayments are deducted directly from the borrower’s salary through an agreed arrangement between the employer and the lender. The employer remits the deducted amounts to Enusha Capital as per the agreed schedule in the executed Memorandum of Understanding (MOU).',
	},
	{
		id: 'employer-funding',
		question: 'Does the employer fund employee loans?',
		answer:
			'No. Enusha funds approved employee loans. The employer does not fund the employee loan book and does not take on a direct borrowing obligation, subject to the executed MOU. Employer participation is the payroll check-off arrangement set out in that MOU.',
	},
	{
		id: 'employer-responsibilities',
		question: 'What responsibilities does the employer have?',
		answer:
			'Employer participation is governed by an executed MOU. Typical responsibilities include facilitating agreed payroll deductions, remitting those amounts on the agreed schedule, nominating HR, Finance, and Payroll contacts, and following the agreed employee-exit notification and settlement process. The MOU sets out the specific duties for each organisation.',
	},
	{
		id: 'automatic-approval',
		question: 'Are all employees automatically approved?',
		answer:
			'No. An employee’s participation in a corporate scheme does not mean a loan will be approved. Employee loans are subject to eligibility, affordability assessment, scheme policy, and credit approval.',
	},
	{
		id: 'repayments',
		question: 'How are repayments collected?',
		answer:
			'Repayments are processed through agreed payroll deductions. The employer remits the deducted amounts to Enusha according to the remittance schedule in the executed MOU.',
	},
	{
		id: 'employee-exit',
		question: 'What happens when an employee leaves the company?',
		answer:
			'Employee exit procedures follow the agreed notification and settlement process in the MOU. The employer notifies Enusha within the agreed timeline so outstanding deductions and settlement can be handled as arranged.',
	},
	{
		id: 'collateral',
		question: 'Is collateral required?',
		answer:
			'No. Collateral is not required for the products described in Enusha’s company profile.',
	},
	{
		id: 'early-repayment',
		question: 'Can an employee repay early?',
		answer:
			'Yes. According to Enusha’s company material, there is no penalty for early or lump-sum repayment.',
	},
	{
		id: 'finsmart',
		question: 'What is FinSmart?',
		answer:
			'FinSmart is Enusha’s financial wellness programme. It gives participating employees financial literacy, practical money management, and wealth-creation education as part of the Staff Check-Off Scheme.',
	},
	{
		id: 'onboarding-timeline',
		question: 'How long does corporate onboarding take?',
		answer:
			'Corporate onboarding typically takes approximately 6–12 weeks from initial engagement to first disbursement. The timeline may vary depending on documentation, due diligence, approval, and MOU execution.',
	},
	{
		id: 'onboarding-documents',
		question: 'What documents are required for onboarding?',
		answer:
			'The corporate onboarding form lists the documents Enusha reviews. These typically include company registration and tax records, ownership or directorship records, payroll and workforce information, and authorised signatory identification. The exact set depends on the organisation and is confirmed during onboarding.',
	},
	{
		id: 'information-protection',
		question: 'How is employee and corporate information protected?',
		answer:
			'Enusha collects corporate and employee-related information to assess, set up, and administer the check-off scheme, as described in the onboarding declaration. Please review Enusha’s Privacy Notice for how information is handled. This page does not provide legal, regulatory, or data-protection assurances.',
	},
]
