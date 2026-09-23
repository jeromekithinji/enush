import Image from 'next/image'

const finsmartBenefits = [
	'Improved financial confidence',
	'Better money-management habits',
	'Reduced financial stress',
	'Greater awareness of responsible borrowing',
	'A more focused and financially resilient workforce',
]

export function FinSmartSection () {
	return (
		<section
			id='finsmart'
			aria-labelledby='finsmart-heading'
			className='bg-charcoal'
		>
			<div className='mx-auto grid w-full max-w-[1280px] items-center gap-10 px-5 py-14 md:px-8 lg:grid-cols-2 lg:gap-14 lg:px-10 lg:py-20'>
				<div>
					<div className='inline-flex rounded-lg bg-white px-3 py-2'>
						<Image
							src='/images/finsmart-logo.jpg'
							alt='FinSmart — Master Your Money. Live Your Best Life.'
							width={1024}
							height={345}
							className='h-12 w-auto sm:h-14'
						/>
					</div>
					<h2
						id='finsmart-heading'
						className='mt-8 font-heading text-[1.85rem] font-semibold leading-[1.2] tracking-tight text-white sm:text-4xl lg:text-[2.5rem]'
					>
						Credit supported by financial wellness
					</h2>
					<p className='mt-5 text-base leading-7 text-zinc-300 lg:text-[1.05rem] lg:leading-8'>
						FinSmart empowers salaried employees with financial literacy,
						practical money management, and strategic wealth-creation education.
						It is included for employees participating in Enusha&apos;s Staff
						Check-Off Scheme.
					</p>
					<p className='mt-4 text-base leading-7 text-zinc-300 lg:text-[1.05rem] lg:leading-8'>
						Our work primarily supports The UN Sustainable Development Goals
						(SDG) 8 – Decent Work and Economic Growth, while contributing to
						SDG 4 – Quality Education and SDG 1 – No Poverty, helping employees
						build financial capability, resilience and a more secure financial
						future.
					</p>
					<ul className='mt-6 space-y-3'>
						{finsmartBenefits.map((benefit) => (
							<li
								key={benefit}
								className='flex items-start gap-3 text-base text-white'
							>
								<span
									aria-hidden='true'
									className='mt-2 size-1.5 shrink-0 rounded-full bg-brand'
								/>
								{benefit}
							</li>
						))}
					</ul>
					<blockquote className='mt-8 font-heading text-base font-semibold italic leading-6 text-brand lg:text-[1.05rem] lg:leading-7'>
						“We aim to be more than a lender. We aim to help every working
						person thrive financially.”
					</blockquote>
				</div>

				<div className='relative overflow-hidden rounded-[1.5rem]'>
					<Image
						src='/images/finsmart-workshop.jpg'
						alt='Professionals in a financial wellness workshop with a whiteboard covering saving and investing'
						width={1024}
						height={682}
						className='h-auto w-full object-cover'
					/>
				</div>
			</div>
		</section>
	)
}
