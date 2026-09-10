import Image from 'next/image'
import {
	Award,
	Handshake,
	Heart,
	Shield,
	Target,
	type LucideIcon,
} from 'lucide-react'

interface CompanyValue {
	title: string
	description: string
	icon: LucideIcon
}

const companyValues: CompanyValue[] = [
	{
		title: 'Integrity',
		description:
			'We act honestly, responsibly and transparently in every decision and interaction.',
		icon: Shield,
	},
	{
		title: 'Customer Centricity',
		description:
			'We listen, understand and design solutions around the real-life needs of our customers.',
		icon: Heart,
	},
	{
		title: 'Responsible Empowerment',
		description:
			'We provide credit and financial education that help people move forward without compromising their long-term financial wellbeing.',
		icon: Award,
	},
	{
		title: 'Reliability',
		description:
			'We deliver on our promises with speed, consistency and care—especially when our customers need us most.',
		icon: Target,
	},
	{
		title: 'Partnership',
		description:
			'We build lasting relationships with employers, employees and stakeholders to create shared and sustainable value.',
		icon: Handshake,
	},
]

export function AboutSection () {
	return (
		<section id='about' aria-labelledby='about-heading'>
			<div className='bg-white'>
				<div className='mx-auto grid w-full max-w-[1280px] items-center gap-10 px-5 py-14 md:px-8 lg:grid-cols-[minmax(0,1.1fr)_1fr] lg:items-stretch lg:gap-12 lg:px-10 lg:py-20'>
					<div>
						<h2
							id='about-heading'
							className='font-heading text-[1.5rem] font-semibold leading-[1.2] tracking-tight text-charcoal sm:text-[1.875rem] lg:text-[2.125rem]'
						>
							A dependable financial partner for employers and employees
						</h2>
						<div className='mt-5 space-y-3 text-sm leading-6 text-muted-foreground lg:text-[0.925rem] lg:leading-6'>
							<p>
								Enusha Capital Limited is a credit-only microfinance company
								providing payroll check-off loans to employees of select
								organisations. We partner directly with employers through a
								signed Memorandum of Understanding, enabling eligible employees
								to access responsible credit while repayments are managed
								through agreed payroll deductions.
							</p>
							<p>
								Enusha also provides FinSmart financial wellness education to
								employees participating in the Staff Check-Off Scheme.
							</p>
						</div>
						<p className='mt-6 flex items-start gap-2.5 rounded-lg bg-cream px-4 py-3 text-sm leading-6 text-charcoal'>
							<span
								aria-hidden='true'
								className='mt-1.5 size-2 shrink-0 rounded-full bg-brand'
							/>
							<span>
								<span className='font-semibold'>Head Office:</span> 147 Rhapata
								Road, Westlands, Nairobi, Kenya.
							</span>
						</p>
					</div>

					<div className='relative mx-auto aspect-[3/2] w-[94%] overflow-hidden rounded-[1.5rem] lg:aspect-auto lg:h-full lg:min-h-full lg:w-full'>
						<Image
							src='/images/about-people-culture.jpg'
							alt='A professional smiling in a modern office with People and Culture, HR Excellence in the background'
							fill
							sizes='(min-width: 1024px) 42vw, 90vw'
							className='object-cover object-[center_20%]'
						/>
					</div>
				</div>
			</div>

			<div className='bg-cream'>
				<div className='mx-auto w-full max-w-[1280px] px-5 py-14 text-center md:px-8 lg:px-10 lg:py-20'>
					<p className='text-xs font-semibold tracking-[0.18em] text-brand uppercase'>
						Our Vision
					</p>
					<p className='mx-auto mt-3 max-w-3xl font-heading text-[1.75rem] font-semibold leading-tight text-charcoal sm:text-4xl lg:text-[2.6rem]'>
						<span className='block'>A future where every working</span>
						<span className='block'>person can thrive financially.</span>
					</p>

					<p className='mt-12 text-xs font-semibold tracking-[0.18em] text-brand uppercase'>
						Our Mission
					</p>
					<p className='mx-auto mt-4 max-w-3xl text-base leading-7 text-muted-foreground lg:text-[1.05rem] lg:leading-8'>
						To provide accessible, responsible and timely financial solutions
						that help employees meet everyday needs, respond to emergencies,
						pursue growth and improve their wellbeing—through trusted employer
						partnerships and financial wellness education.
					</p>

					<h3 className='mt-16 font-heading text-3xl font-semibold text-charcoal sm:text-4xl'>
						Our Values
					</h3>
					<ul className='mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5'>
						{companyValues.map((value) => {
							const Icon = value.icon

							return (
								<li
									key={value.title}
									className='flex flex-col items-center rounded-2xl bg-white px-5 py-6 text-center shadow-[0_8px_24px_rgba(0,0,0,0.04)]'
								>
									<span className='flex size-11 items-center justify-center rounded-full bg-accent'>
										<Icon
											aria-hidden='true'
											className='size-5 text-brand'
											strokeWidth={1.75}
										/>
									</span>
									<h4 className='mt-4 font-heading text-lg font-semibold text-charcoal'>
										{value.title}
									</h4>
									<p className='mt-2 text-sm leading-6 text-muted-foreground'>
										{value.description}
									</p>
								</li>
							)
						})}
					</ul>
				</div>
			</div>
		</section>
	)
}
