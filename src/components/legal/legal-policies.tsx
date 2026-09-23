const legalSections = [
	{
		id: 'terms-of-use',
		title: 'Terms of Use',
		body: 'By using Enusha’s services, customers agree to the applicable terms and conditions governing their loan or financial service. We are committed to ensuring that key information—including loan amounts, interest rates, fees, repayment periods and other obligations—is communicated clearly before a customer accepts a facility. Customers are encouraged to review and understand the applicable terms before proceeding.',
	},
	{
		id: 'responsible-lending',
		title: 'Responsible Lending',
		body: 'At Enusha, responsible lending means providing fair, transparent and affordable credit based on an employee’s ability to repay. We promote informed borrowing, clear pricing and manageable repayments, helping employees meet important financial needs without compromising their long-term financial wellbeing.',
	},
	{
		id: 'complaints',
		title: 'Complaints & Customer Support',
		body: 'We are committed to treating our customers fairly and resolving concerns promptly. If you have a question, need assistance or are dissatisfied with any aspect of our service, please contact our Customer Support team through our designated support channels. Every complaint will be acknowledged, reviewed fairly and handled confidentially, with the aim of providing a timely resolution.',
	},
] as const

export function LegalPolicies () {
	return (
		<div className='mx-auto w-full max-w-3xl px-5 py-14 md:px-8 lg:px-10 lg:py-20'>
			<p className='text-xs font-semibold tracking-[0.18em] text-brand uppercase'>
				Legal
			</p>
			<h1 className='mt-3 font-heading text-3xl font-semibold tracking-tight text-charcoal md:text-4xl'>
				Legal
			</h1>
			<div className='mt-10 space-y-10'>
				{legalSections.map((section) => (
					<section
						key={section.id}
						id={section.id}
						aria-labelledby={`${section.id}-heading`}
						className='scroll-mt-28'
					>
						<h2
							id={`${section.id}-heading`}
							className='font-heading text-2xl font-semibold tracking-tight text-charcoal'
						>
							{section.title}
						</h2>
						<p className='mt-4 text-base leading-7 text-muted-foreground'>
							{section.body}
						</p>
					</section>
				))}
			</div>
		</div>
	)
}
