export interface LoanProductConfig {
	id: string
	name: string
	category: string
	monthlyRate: number
	minAmount: number
	maxAmount: number
	minTenor: number
	maxTenor: number
	isPaydayAdvance: boolean
}

export interface AmortizationRow {
	month: number
	openingBalance: number
	interest: number
	principalRepaid: number
	monthlyPayment: number
	closingBalance: number
}

export const LOAN_PRODUCTS: LoanProductConfig[] = [
	{
		id: 'fees-bila-stress',
		name: 'Fees Bila Stress',
		category: 'School Fees',
		monthlyRate: 0.09,
		minAmount: 10000,
		maxAmount: 100000,
		minTenor: 1,
		maxTenor: 4,
		isPaydayAdvance: false,
	},
	{
		id: 'enusha-elevate',
		name: 'Enusha Elevate',
		category: 'Professional Development',
		monthlyRate: 0.1,
		minAmount: 15000,
		maxAmount: 150000,
		minTenor: 1,
		maxTenor: 12,
		isPaydayAdvance: false,
	},
	{
		id: 'enusha-nyumba-upgrade',
		name: 'Enusha Nyumba Upgrade',
		category: 'Home & Lifestyle',
		monthlyRate: 0.11,
		minAmount: 15000,
		maxAmount: 200000,
		minTenor: 1,
		maxTenor: 12,
		isPaydayAdvance: false,
	},
	{
		id: 'enusha-dharura',
		name: 'Enusha Dharura',
		category: 'Emergency Loan',
		monthlyRate: 0.1,
		minAmount: 10000,
		maxAmount: 100000,
		minTenor: 1,
		maxTenor: 6,
		isPaydayAdvance: false,
	},
	{
		id: 'enusha-sasa',
		name: 'Enusha Sasa',
		category: 'Salary Advance',
		monthlyRate: 0.09,
		minAmount: 5000,
		maxAmount: 100000,
		minTenor: 1,
		maxTenor: 1,
		isPaydayAdvance: true,
	},
	{
		id: 'enusha-raha',
		name: 'Enusha Raha',
		category: 'Wellness, Self-Care and Growth',
		monthlyRate: 0.1,
		minAmount: 10000,
		maxAmount: 100000,
		minTenor: 1,
		maxTenor: 6,
		isPaydayAdvance: false,
	},
]

export function getLoanProduct (
	productId: string,
): LoanProductConfig | undefined {
	return LOAN_PRODUCTS.find((product) => product.id === productId)
}

export function clampNumber (
	value: number,
	min: number,
	max: number,
): number {
	return Math.min(max, Math.max(min, value))
}

export function roundCurrency (value: number): number {
	return Math.round(value * 100) / 100
}

/**
 * Equal monthly instalment on a reducing-balance basis.
 * `monthlyRate` is the monthly decimal rate (for example 0.09 for 9%).
 */
export function calculateMonthlyRepayment (
	principal: number,
	monthlyRate: number,
	tenorMonths: number,
): number {
	if (principal <= 0 || tenorMonths <= 0) {
		return 0
	}

	if (monthlyRate === 0) {
		return principal / tenorMonths
	}

	const growth = (1 + monthlyRate) ** tenorMonths
	return (principal * monthlyRate * growth) / (growth - 1)
}

/**
 * Month-by-month reducing-balance schedule. The final closing balance is 0.
 */
export function calculateAmortizationSchedule (
	principal: number,
	monthlyRate: number,
	tenorMonths: number,
): AmortizationRow[] {
	const monthlyPayment = roundCurrency(
		calculateMonthlyRepayment(principal, monthlyRate, tenorMonths),
	)
	const rows: AmortizationRow[] = []
	let openingBalance = principal

	for (let month = 1; month <= tenorMonths; month += 1) {
		const interest = openingBalance * monthlyRate
		const isLastMonth = month === tenorMonths
		const principalRepaid = isLastMonth
			? openingBalance
			: Math.min(monthlyPayment - interest, openingBalance)
		const payment = isLastMonth
			? interest + principalRepaid
			: monthlyPayment
		const closingBalance = isLastMonth
			? 0
			: openingBalance - principalRepaid

		rows.push({
			month,
			openingBalance,
			interest,
			principalRepaid,
			monthlyPayment: payment,
			closingBalance,
		})
		openingBalance = closingBalance
	}

	return rows
}

export function formatKes (value: number): string {
	return `KES ${roundCurrency(value).toLocaleString('en-KE', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`
}

export function formatKesRange (min: number, max: number): string {
	return `KES ${min.toLocaleString('en-KE')} – ${max.toLocaleString('en-KE')}`
}

export function getMonthlyRatePercent (monthlyRate: number): number {
	return Math.round(monthlyRate * 100)
}

export function getInterestRateLabel (monthlyRate: number): string {
	return `${getMonthlyRatePercent(monthlyRate)}% monthly on reducing balance`
}
