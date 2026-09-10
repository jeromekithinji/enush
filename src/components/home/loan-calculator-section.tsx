'use client'

import { useMemo, useState } from 'react'
import { Calculator, ChevronDown, TrendingDown } from 'lucide-react'

import {
	LOAN_PRODUCTS,
	calculateAmortizationSchedule,
	calculateMonthlyRepayment,
	clampNumber,
	formatKes,
	formatKesRange,
	getInterestRateLabel,
	getLoanProduct,
	getMonthlyRatePercent,
	type LoanProductConfig,
} from '@/lib/loan-calculator'
import { cn } from '@/lib/utils'

const DEFAULT_PRODUCT_ID = 'fees-bila-stress'
const DEFAULT_AMOUNT = 50000
const DEFAULT_TENOR = 4

function getProduct (productId: string): LoanProductConfig {
	return getLoanProduct(productId) ?? LOAN_PRODUCTS[0]
}

function RangeSlider ({
	min,
	max,
	step,
	value,
	onChange,
	ariaLabel,
}: {
	min: number
	max: number
	step: number
	value: number
	onChange: (nextValue: number) => void
	ariaLabel: string
}) {
	const percent = max === min ? 100 : ((value - min) / (max - min)) * 100

	return (
		<div className='relative h-7'>
			<div className='pointer-events-none absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-charcoal' />
			<div
				className='pointer-events-none absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-brand'
				style={{ width: `${percent}%` }}
			/>
			<input
				type='range'
				min={min}
				max={max}
				step={step}
				value={value}
				aria-label={ariaLabel}
				onChange={(event) => onChange(Number(event.target.value))}
				className='absolute inset-0 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:bg-transparent [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-brand'
			/>
		</div>
	)
}

export function LoanCalculatorSection () {
	const [productId, setProductId] = useState(DEFAULT_PRODUCT_ID)
	const [amount, setAmount] = useState(DEFAULT_AMOUNT)
	const [amountInput, setAmountInput] = useState(String(DEFAULT_AMOUNT))
	const [tenor, setTenor] = useState(DEFAULT_TENOR)
	const [isScheduleOpen, setIsScheduleOpen] = useState(false)

	const product = getProduct(productId)
	const monthlyPayment = useMemo(
		() => calculateMonthlyRepayment(amount, product.monthlyRate, tenor),
		[amount, product.monthlyRate, tenor],
	)
	const schedule = useMemo(
		() => calculateAmortizationSchedule(amount, product.monthlyRate, tenor),
		[amount, product.monthlyRate, tenor],
	)
	const ratePercent = getMonthlyRatePercent(product.monthlyRate)
	const tenorOptions = Array.from(
		{ length: product.maxTenor - product.minTenor + 1 },
		(_, index) => product.minTenor + index,
	)

	function applyAmount (nextAmount: number) {
		const clamped = clampNumber(
			nextAmount,
			product.minAmount,
			product.maxAmount,
		)
		setAmount(clamped)
		setAmountInput(String(clamped))
	}

	function handleProductChange (nextProductId: string) {
		const nextProduct = getProduct(nextProductId)
		const nextAmount = clampNumber(
			amount,
			nextProduct.minAmount,
			nextProduct.maxAmount,
		)
		const nextTenor = clampNumber(
			tenor,
			nextProduct.minTenor,
			nextProduct.maxTenor,
		)

		setProductId(nextProduct.id)
		setAmount(nextAmount)
		setAmountInput(String(nextAmount))
		setTenor(nextTenor)
	}

	function handleAmountBlur () {
		const parsed = Number(amountInput.replace(/,/g, ''))
		if (Number.isFinite(parsed)) {
			applyAmount(parsed)
			return
		}

		setAmountInput(String(amount))
	}

	return (
		<section
			id='calculator'
			aria-labelledby='calculator-heading'
			className='bg-cream'
		>
			<div className='mx-auto w-full max-w-[1280px] px-5 py-14 md:px-8 lg:px-10 lg:py-20'>
				<p className='text-center text-xs font-semibold tracking-[0.18em] text-brand uppercase'>
					Loan Calculator
				</p>
				<h2
					id='calculator-heading'
					className='mt-3 text-center font-heading text-[1.85rem] font-semibold tracking-tight text-charcoal sm:text-4xl'
				>
					Plan your repayment
				</h2>
				<p className='mx-auto mt-3 max-w-3xl text-center text-base leading-7 text-muted-foreground'>
					Select your loan product to see the applicable interest rate, then
					calculate your monthly instalment on a{' '}
					<span className='font-semibold text-charcoal'>reducing balance</span>{' '}
					basis with equal monthly repayments.
				</p>

				<div className='mt-10 grid grid-cols-1 items-start gap-6 lg:grid-cols-2'>
					<div className='rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.04)] sm:p-7'>
						<div className='flex items-center gap-2'>
							<Calculator
								aria-hidden='true'
								className='size-5 text-brand'
								strokeWidth={1.75}
							/>
							<h3 className='font-heading text-xl font-semibold text-charcoal'>
								Loan Details
							</h3>
						</div>

						<label
							htmlFor='loan-product'
							className='mt-6 block text-sm font-medium text-charcoal'
						>
							Select Loan Product
						</label>
						<select
							id='loan-product'
							value={product.id}
							onChange={(event) => handleProductChange(event.target.value)}
							className='mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-charcoal outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/30'
						>
							{LOAN_PRODUCTS.map((item) => (
								<option key={item.id} value={item.id}>
									{item.name} — {item.category} (
									{getMonthlyRatePercent(item.monthlyRate)}%/mo)
								</option>
							))}
						</select>

						<div className='mt-3 flex flex-wrap gap-2'>
							<span className='rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white'>
								Rate: {ratePercent}%/month
							</span>
							<span className='rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-charcoal'>
								{product.isPaydayAdvance
									? `From KES ${product.minAmount.toLocaleString('en-KE')}`
									: formatKesRange(product.minAmount, product.maxAmount)}
							</span>
							<span className='rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-charcoal'>
								{product.isPaydayAdvance
									? 'Until next payday'
									: `Max ${product.maxTenor} months`}
							</span>
						</div>

						<label
							htmlFor='loan-amount'
							className='mt-6 block text-sm font-medium text-charcoal'
						>
							Loan Principal Amount (KES)
						</label>
						<input
							id='loan-amount'
							type='text'
							inputMode='numeric'
							value={amountInput}
							onChange={(event) => setAmountInput(event.target.value)}
							onBlur={handleAmountBlur}
							className='mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-base font-semibold text-charcoal outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/30'
						/>
						<div className='mt-3'>
							<RangeSlider
								min={product.minAmount}
								max={product.maxAmount}
								step={500}
								value={amount}
								ariaLabel='Loan principal amount'
								onChange={applyAmount}
							/>
							<div className='mt-1 flex justify-between text-xs text-muted-foreground'>
								<span>
									KES {product.minAmount.toLocaleString('en-KE')}
								</span>
								<span>
									KES {product.maxAmount.toLocaleString('en-KE')}
								</span>
							</div>
						</div>

						<p className='mt-6 text-sm font-medium text-charcoal'>
							Loan Repayment Period (No. of Months)
						</p>
						{product.isPaydayAdvance ? (
							<p className='mt-2 rounded-md bg-zinc-100 px-3 py-2 text-sm font-semibold text-charcoal'>
								Until next payday
							</p>
						) : (
							<div
								className='mt-2 grid gap-2'
								style={{
									gridTemplateColumns: `repeat(${Math.min(tenorOptions.length, 4)}, minmax(0, 1fr))`,
								}}
							>
								{tenorOptions.map((months) => (
									<button
										key={months}
										type='button'
										onClick={() => setTenor(months)}
										className={cn(
											'h-10 rounded-md text-sm font-semibold',
											tenor === months
												? 'bg-brand text-white'
												: 'bg-zinc-100 text-charcoal hover:bg-zinc-200',
										)}
									>
										{months} mo
									</button>
								))}
							</div>
						)}
						<div className='mt-3'>
							<RangeSlider
								min={product.minTenor}
								max={product.maxTenor}
								step={1}
								value={tenor}
								ariaLabel='Loan repayment period in months'
								onChange={setTenor}
							/>
							<div className='mt-1 flex justify-between text-xs text-muted-foreground'>
								<span>
									{product.isPaydayAdvance
										? 'Next payday'
										: `${product.minTenor} month`}
								</span>
								<span>
									{product.isPaydayAdvance
										? 'Eligible days worked'
										: `${product.maxTenor} months (max)`}
								</span>
							</div>
						</div>

						<div className='mt-6 flex items-start gap-3 rounded-xl border border-brand/20 bg-accent px-4 py-3'>
							<TrendingDown
								aria-hidden='true'
								className='mt-0.5 size-5 shrink-0 text-brand'
								strokeWidth={1.75}
							/>
							<p className='text-sm leading-6 text-charcoal'>
								Monthly Interest Rate:{' '}
								<span className='font-semibold'>
									{ratePercent}% on reducing balance
								</span>{' '}
								— you pay less interest as your principal decreases each month.
							</p>
						</div>
					</div>

					<div className='rounded-2xl bg-charcoal p-5 sm:p-7'>
						<h3 className='font-heading text-2xl font-semibold text-brand'>
							Your Repayment Summary
						</h3>
						<p className='mt-1 text-sm text-zinc-400'>
							{product.name} — {product.category}
						</p>

						<div className='mt-6 rounded-xl border border-brand/50 bg-[#2a221c] px-5 py-5'>
							<p className='text-sm text-brand'>
								Monthly Payment (Equal Instalments)
							</p>
							<p className='mt-2 font-heading text-3xl font-semibold text-brand sm:text-4xl'>
								{formatKes(monthlyPayment)}
							</p>
							<p className='mt-2 text-sm text-zinc-400'>
								{product.isPaydayAdvance
									? 'Equal payment due by the next payday'
									: `Equal payment each month for ${tenor} months`}
							</p>
						</div>

						<div className='mt-4 grid grid-cols-2 gap-3'>
							<div className='rounded-xl bg-white/5 px-4 py-4'>
								<p className='text-sm text-zinc-400'>Loan Principal</p>
								<p className='mt-1 text-lg font-semibold text-white'>
									{formatKes(amount)}
								</p>
							</div>
							<div className='rounded-xl bg-white/5 px-4 py-4'>
								<p className='text-sm text-zinc-400'>Loan Tenor</p>
								<p className='mt-1 text-lg font-semibold text-white'>
									{product.isPaydayAdvance
										? 'Until next payday'
										: `${tenor} months`}
								</p>
							</div>
							<div className='col-span-2 rounded-xl bg-white/5 px-4 py-4'>
								<p className='text-sm text-zinc-400'>Interest Rate</p>
								<p className='mt-1 text-lg font-semibold text-white'>
									{getInterestRateLabel(product.monthlyRate)}
								</p>
							</div>
						</div>

						<button
							type='button'
							onClick={() => setIsScheduleOpen((open) => !open)}
							aria-expanded={isScheduleOpen}
							className='mt-6 mx-auto flex items-center gap-1 text-sm font-semibold text-brand'
						>
							View Amortization Schedule
							<ChevronDown
								aria-hidden='true'
								className={cn(
									'size-4 transition-transform',
									isScheduleOpen && 'rotate-180',
								)}
							/>
						</button>

						{isScheduleOpen ? (
							<div className='mt-4 overflow-x-auto'>
								<table className='w-full min-w-[520px] text-left text-sm'>
									<caption className='sr-only'>
										Amortization schedule for {product.name}
									</caption>
									<thead>
										<tr className='text-xs tracking-wide text-zinc-400 uppercase'>
											<th className='pb-2 font-medium'>Month</th>
											<th className='pb-2 font-medium'>Opening</th>
											<th className='pb-2 font-medium'>Interest</th>
											<th className='pb-2 font-medium'>Principal</th>
											<th className='pb-2 font-medium'>Closing</th>
										</tr>
									</thead>
									<tbody>
										{schedule.map((row) => (
											<tr
												key={row.month}
												className='border-t border-white/10 text-white'
											>
												<td className='py-2.5'>{row.month}</td>
												<td className='py-2.5'>
													{formatKes(row.openingBalance)}
												</td>
												<td className='py-2.5'>
													{formatKes(row.interest)}
												</td>
												<td className='py-2.5'>
													{formatKes(row.principalRepaid)}
												</td>
												<td className='py-2.5'>
													{formatKes(row.closingBalance)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : null}
					</div>
				</div>

				<p className='mx-auto mt-8 max-w-3xl text-center text-xs leading-5 text-muted-foreground'>
					This calculator provides indicative figures only. Actual loan amounts,
					rates, and terms are subject to employer participation, employee
					eligibility and final credit approval. Product terms may change.
				</p>
			</div>
		</section>
	)
}
