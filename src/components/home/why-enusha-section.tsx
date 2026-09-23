import {
	BookOpen,
	Heart,
	Shield,
	TrendingDown,
	Users,
	Zap,
	type LucideIcon,
} from 'lucide-react'

interface Differentiator {
	title: string
	description: string
	icon: LucideIcon
}

interface AudienceBenefits {
	title: string
	icon: LucideIcon
	iconTone: 'dark' | 'brand'
	items: string[]
}

const differentiators: Differentiator[] = [
	{
		title: 'Speed',
		description:
			'Approved employee applications can receive same-day disbursement.',
		icon: Zap,
	},
	{
		title: 'No Collateral',
		description: 'Employees can access credit without providing collateral.',
		icon: Shield,
	},
	{
		title: 'Fairer Repayment',
		description:
			'Interest is calculated on a reducing balance, with no penalty for early or lump-sum repayment.',
		icon: TrendingDown,
	},
	{
		title: 'Financial Wellness Included',
		description:
			'Participating employees receive access to FinSmart financial wellness education.',
		icon: BookOpen,
	},
]

const audienceBenefits: AudienceBenefits[] = [
	{
		title: 'For Corporate Partners',
		icon: Users,
		iconTone: 'dark',
		items: [
			"Eases pressure on the organisation's operating cash flow.",
			'Reduces the cost and administrative effort of managing salary advances internally.',
			'Supports employee productivity, focus, and financial wellbeing.',
			'Accommodates employees across salary levels, subject to agreed eligibility requirements.',
			'Provides clear monthly deduction and repayment schedules.',
			'Requires no employer funding of the employee loan book.',
			'Creates no direct borrowing obligation for the employer, subject to the executed MOU.',
			'Supports structured administration through designated HR, Finance, and Payroll contacts.',
		],
	},
	{
		title: 'For Employees',
		icon: Heart,
		iconTone: 'brand',
		items: [
			'No collateral required.',
			'Convenient application through the workplace or approved digital process.',
			'Same-day disbursement after approval.',
			'Interest calculated on a reducing balance.',
			'No penalty for early or lump-sum repayment.',
			'Multiple products designed for different stages and moments of life.',
			'Free financial wellness education through FinSmart.',
		],
	},
]

export function WhyEnushaSection () {
	return (
		<section id='why-enusha' aria-labelledby='why-enusha-heading'>
			<div className='bg-white'>
				<div className='mx-auto w-full max-w-[1280px] px-5 py-14 md:px-8 lg:px-10 lg:py-20'>
					<h2
						id='why-enusha-heading'
						className='text-center font-heading text-[1.85rem] font-semibold tracking-tight text-charcoal sm:text-4xl'
					>
						What makes Enusha different
					</h2>
					<ul className='mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
						{differentiators.map((item) => {
							const Icon = item.icon

							return (
								<li
									key={item.title}
									className='rounded-2xl border border-zinc-100 bg-white px-6 py-8 text-center shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-colors hover:border-brand'
								>
									<span className='mx-auto flex size-14 items-center justify-center rounded-full bg-accent'>
										<Icon
											aria-hidden='true'
											className='size-6 text-brand'
											strokeWidth={1.75}
										/>
									</span>
									<h3 className='mt-5 font-heading text-xl font-semibold text-charcoal'>
										{item.title}
									</h3>
									<p className='mt-2 text-sm leading-6 text-muted-foreground'>
										{item.description}
									</p>
								</li>
							)
						})}
					</ul>
				</div>
			</div>

			<div id='corporate-benefits' className='bg-cream'>
				<div className='mx-auto w-full max-w-[1280px] px-5 py-14 md:px-8 lg:px-10 lg:py-20'>
					<h3 className='text-center font-heading text-[1.75rem] font-semibold tracking-tight text-charcoal sm:text-4xl'>
						Benefits for corporate partners and employees
					</h3>
					<div className='mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2'>
						{audienceBenefits.map((audience) => {
							const Icon = audience.icon

							return (
								<article
									key={audience.title}
									className='rounded-2xl bg-white px-6 py-8 shadow-[0_8px_24px_rgba(0,0,0,0.04)] sm:px-8'
								>
									<div className='flex items-center gap-3'>
										<span
											className={
												audience.iconTone === 'brand'
													? 'flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand'
													: 'flex size-11 shrink-0 items-center justify-center rounded-lg bg-charcoal'
											}
										>
											<Icon
												aria-hidden='true'
												className={
													audience.iconTone === 'brand'
														? 'size-5 text-white'
														: 'size-5 text-brand'
												}
												strokeWidth={1.75}
											/>
										</span>
										<h4 className='font-heading text-xl font-semibold text-charcoal sm:text-2xl'>
											{audience.title}
										</h4>
									</div>
									<ul className='mt-6 space-y-3'>
										{audience.items.map((benefit) => (
											<li
												key={benefit}
												className='flex items-start gap-3 text-sm leading-6 text-muted-foreground sm:text-[0.95rem]'
											>
												<span
													aria-hidden='true'
													className='mt-2 size-1.5 shrink-0 rounded-full bg-brand'
												/>
												{benefit}
											</li>
										))}
									</ul>
								</article>
							)
						})}
					</div>
				</div>
			</div>
		</section>
	)
}
