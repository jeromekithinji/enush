import Image from 'next/image'

interface LoanProduct {
	name: string
	category: string
	tagline: string
	description: string
	amount: string
	tenor: string
	interest: string
	image?: {
		src: string
		alt: string
	}
}

const loanProducts: LoanProduct[] = [
	{
		name: 'Fees Bila Stress',
		category: 'School Fees',
		tagline: 'School fees, sorted—before the term even starts.',
		description:
			'For salaried parents and guardians managing school-fee obligations and seasonal education expenses.',
		amount: 'KES 10K–100K',
		tenor: 'Up to 4 months',
		interest: '10%',
		image: {
			src: '/images/loan-fees-bila-stress.jpg',
			alt: 'A parent hugging a child with a backpack at the doorway',
		},
	},
	{
		name: 'Enusha Elevate',
		category: 'Professional Development',
		tagline: 'Invest in your next level.',
		description:
			'For salaried employees pursuing professional courses, certifications, and career development.',
		amount: 'KES 15K–150K',
		tenor: 'Up to 6 months',
		interest: '10%',
		image: {
			src: '/images/loan-elevate.jpg',
			alt: 'A professional studying at a desk with a notebook and laptop',
		},
	},
	{
		name: 'Enusha Nyumba Upgrade',
		category: 'Home & Lifestyle',
		tagline: 'Home upgrades, made easy.',
		description:
			'For employees purchasing home appliances, furniture, electronics, and other practical home improvements.',
		amount: 'KES 15K–200K',
		tenor: 'Up to 6 months',
		interest: '10%',
		image: {
			src: '/images/loan-nyumba.jpg',
			alt: 'A couple placing a coffee table in a bright living room',
		},
	},
	{
		name: 'Enusha Dharura',
		category: 'Emergency Loan',
		tagline: "When life doesn't wait, neither do we.",
		description:
			'For salaried employees responding to urgent medical, insurance, bridging, or unexpected expenses.',
		amount: 'KES 10K–100K',
		tenor: 'Up to 6 months',
		interest: '10%',
		image: {
			src: '/images/loan-dharura.jpg',
			alt: 'A man sitting on a sofa looking worried with his hands clasped',
		},
	},
	{
		name: 'Enusha Sasa',
		category: 'Salary Advance',
		tagline: 'Your salary, a little sooner.',
		description:
			'For eligible employees managing short-term cash-flow needs before their next salary payment.',
		amount: 'From KES 5,000',
		tenor: 'Until next payday',
		interest: '9%',
		image: {
			src: '/images/loan-sasa.jpg',
			alt: 'A smiling man sitting on a sofa holding cash',
		},
	},
	{
		name: 'Enusha Raha',
		category: 'Wellness, Self-Care and Growth',
		tagline: 'Your comfort, your joy, your time to recharge.',
		description:
			'For employees investing in wellness, rest, holidays, retreats, gym memberships, and personal growth.',
		amount: 'KES 10K–100K',
		tenor: 'Up to 6 months',
		interest: '10%',
		image: {
			src: '/images/loan-raha-wellness.jpg',
			alt: 'A woman relaxing outdoors in a lounge chair with her eyes closed',
		},
	},
]

export function LoanSolutionsSection () {
	return (
		<section
			id='loan-solutions'
			aria-labelledby='loan-solutions-heading'
			className='bg-zinc-50'
		>
			<div className='mx-auto w-full max-w-[1280px] px-5 py-14 md:px-8 lg:px-10 lg:py-20'>
				<h2
					id='loan-solutions-heading'
					className='text-center font-heading text-[1.85rem] font-semibold tracking-tight text-charcoal sm:text-4xl'
				>
					Six loan solutions
				</h2>
				<p className='mx-auto mt-3 max-w-5xl text-center text-base leading-7 text-muted-foreground md:whitespace-nowrap'>
					Financial solutions for every moment of life—delivered responsibly,
					reliably and without stress.
				</p>

				<ul className='mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3'>
					{loanProducts.map((product) => (
						<li key={product.name} className='h-full'>
							<article className='flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)]'>
								{product.image ? (
									<div className='relative h-44 w-full shrink-0 sm:h-48'>
										<Image
											src={product.image.src}
											alt={product.image.alt}
											fill
											sizes='(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw'
											className='object-cover'
											priority={product.name === 'Enusha Raha'}
										/>
									</div>
								) : null}
								<div className='flex flex-1 flex-col px-5 py-5 sm:px-6'>
									<p className='text-[11px] font-semibold tracking-[0.16em] text-brand uppercase'>
										{product.category}
									</p>
									<h3 className='mt-2 font-heading text-xl font-semibold text-charcoal'>
										{product.name}
									</h3>
									<p className='mt-1 font-heading text-sm italic text-muted-foreground'>
										“{product.tagline}”
									</p>
									<p className='mt-3 text-sm leading-6 text-muted-foreground'>
										{product.description}
									</p>
									<dl className='mt-auto grid grid-cols-3 gap-2 border-t border-zinc-100 pt-4'>
										<div>
											<dt className='text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase'>
												Amount
											</dt>
											<dd className='mt-1 text-sm font-semibold text-charcoal'>
												{product.amount}
											</dd>
										</div>
										<div>
											<dt className='text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase'>
												Tenor
											</dt>
											<dd className='mt-1 text-sm font-semibold text-charcoal'>
												{product.tenor}
											</dd>
										</div>
										<div>
											<dt className='text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase'>
												Interest
											</dt>
											<dd className='mt-1 text-sm font-semibold text-charcoal'>
												{product.interest}
											</dd>
										</div>
									</dl>
								</div>
							</article>
						</li>
					))}
				</ul>

				<p className='mt-8 rounded-lg bg-cream px-4 py-3 text-center text-[11px] leading-4 text-muted-foreground sm:text-[13px] sm:leading-5'>
					Loan availability, limits, tenor, pricing, and approval are subject to
					employer participation, employee eligibility, affordability
					assessment, applicable policies, and final credit approval.
				</p>

				<button
					type='button'
					className='mx-auto mt-6 flex h-14 w-fit items-center justify-center rounded-md border border-charcoal bg-white px-8 text-base font-bold text-charcoal transition-colors hover:bg-charcoal hover:text-white'
				>
					Ask Your HR Team About Enusha
				</button>
			</div>
		</section>
	)
}
