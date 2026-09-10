const stats = [
	{ value: '1,000+', label: 'Customers Served' },
	{ value: '12+', label: 'Partner Companies' },
	{ value: 'Same-Day', label: 'Disbursement After Approval' },
	{ value: 'Reducing', label: 'Balance Interest' },
	{ value: 'Zero', label: 'Collateral Required' },
]

export function StatsBar () {
	return (
		<section
			aria-label='Company highlights'
			className='bg-charcoal'
		>
			<div className='mx-auto grid w-full max-w-[1280px] grid-cols-2 gap-x-6 gap-y-8 px-5 py-10 md:px-8 lg:grid-cols-5 lg:gap-8 lg:px-10 lg:py-12'>
				{stats.map((stat) => (
					<div
						key={stat.label}
						className='flex flex-col items-center text-center'
					>
						<p className='font-sans text-2xl font-bold text-brand sm:text-3xl'>
							{stat.value}
						</p>
						<p className='mt-1 text-sm text-white'>{stat.label}</p>
					</div>
				))}
			</div>
		</section>
	)
}
