export interface NavItem {
	href: string
	label: string
	description: string
}

export const navItems: NavItem[] = [
	{
		href: '/#about',
		label: 'About',
		description: 'Learn who Enusha Capital is and how we partner with employers.',
	},
	{
		href: '/#why-enusha',
		label: 'Why Enusha',
		description: 'See why employers and employees choose Enusha Capital.',
	},
	{
		href: '/#how-it-works',
		label: 'How It Works',
		description: 'Walk through the corporate onboarding and payroll check-off process.',
	},
	{
		href: '/#loan-solutions',
		label: 'Loan Solutions',
		description: 'Explore responsible payroll check-off loan solutions for employees.',
	},
	{
		href: '/#calculator',
		label: 'Calculator',
		description: 'Estimate loan repayments with the Enusha repayment calculator.',
	},
	{
		href: '/#finsmart',
		label: 'FinSmart',
		description: 'Financial wellness education for employees through FinSmart.',
	},
	{
		href: '/corporate-benefits',
		label: 'Corporate Benefits',
		description: 'Benefits of partnering with Enusha Capital for your organisation.',
	},
	{
		href: '/#faqs',
		label: 'FAQs',
		description: 'Answers to common questions from employers, HR teams, and employees.',
	},
]

export const primaryCta = {
	href: '/#onboard',
	label: 'Start Corporate Onboarding',
	description: 'Begin corporate onboarding to offer Enusha loans as an employee benefit.',
}

export const secondaryCta = {
	href: '/#loan-solutions',
	label: 'Explore Our Loan Solutions',
}
