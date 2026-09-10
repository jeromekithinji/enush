import { HashLink } from '@/components/layout/hash-link'
import { Button } from '@/components/ui/button'
import { primaryCta } from '@/lib/nav'

const onboardingSteps = [
	{
		number: '1',
		title: 'Discover & Qualify',
		description:
			'Enusha learns about the organisation, workforce, payroll structure, and employee needs.',
	},
	{
		number: '2',
		title: 'Review & Due Diligence',
		description:
			'The company completes the onboarding form and provides the required corporate information and documents.',
	},
	{
		number: '3',
		title: 'Agree & Onboard',
		description:
			'Enusha reviews the submission, completes due diligence, and prepares the MOU for approved corporate partners.',
	},
	{
		number: '4',
		title: 'Activate the Scheme',
		description:
			'HR, Finance, and Payroll teams receive the agreed procedures, schedules, employee communication, and scheme-launch support.',
	},
]

export function HowItWorksSection () {
	return (
		<section id='how-it-works' aria-labelledby='how-it-works-heading'>
			<div className='bg-zinc-50'>
				<div className='mx-auto w-full max-w-[1280px] px-5 py-14 md:px-8 lg:px-10 lg:py-20'>
					<h2
						id='how-it-works-heading'
						className='text-center font-heading text-[1.85rem] font-semibold tracking-tight text-charcoal sm:text-4xl'
					>
						How corporate onboarding works
					</h2>

					<ol className='mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-4 xl:gap-8'>
						{onboardingSteps.map((step) => (
							<li
								key={step.number}
								className='flex flex-col items-center text-center'
							>
								<span className='flex size-12 items-center justify-center rounded-full bg-brand font-heading text-xl font-semibold text-white'>
									{step.number}
								</span>
								<h3 className='mt-4 font-heading text-xl font-semibold text-charcoal'>
									{step.title}
								</h3>
								<p className='mt-2 max-w-xs text-sm leading-6 text-muted-foreground'>
									{step.description}
								</p>
							</li>
						))}
					</ol>

					<p className='mt-12 rounded-xl border border-zinc-200 bg-white px-5 py-4 text-center text-sm leading-6 text-muted-foreground sm:px-8'>
						Typical journey from initial engagement to first disbursement:
						approximately 6–12 weeks, subject to timely documentation, due
						diligence, approval, and MOU execution.
					</p>
				</div>
			</div>

			<div className='bg-brand'>
				<div className='mx-auto flex w-full max-w-[800px] flex-col items-center px-5 py-14 text-center md:px-8 lg:py-20'>
					<h3 className='font-heading text-[1.75rem] font-semibold leading-tight text-white sm:text-4xl'>
						Bring responsible financial support to your workforce
					</h3>
					<p className='mt-4 max-w-2xl text-base leading-7 text-white/95'>
						Complete the corporate onboarding form to help Enusha understand
						your organisation, workforce, payroll process, and proposed
						check-off requirements.
					</p>
					<Button
						asChild
						className='mt-8 h-12 w-full rounded-md bg-charcoal px-6 text-sm font-semibold text-white hover:bg-charcoal/90 sm:w-auto'
					>
						<HashLink href={primaryCta.href}>{primaryCta.label}</HashLink>
					</Button>
				</div>
			</div>
		</section>
	)
}
