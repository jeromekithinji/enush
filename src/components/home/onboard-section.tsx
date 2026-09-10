import { OnboardingForm } from '@/components/onboard/onboarding-form'

export function OnboardSection () {
	return (
		<section id='onboard' aria-labelledby='onboard-heading'>
			<div className='bg-zinc-100'>
				<div className='mx-auto w-full max-w-5xl px-5 py-14 md:px-8 lg:px-10 lg:py-20'>
					<div className='mb-8 text-center md:mb-10'>
						<h2
							id='onboard-heading'
							className='font-heading text-3xl font-semibold tracking-tight text-charcoal md:text-4xl lg:text-[2.75rem]'
						>
							Corporate Check-Off Onboarding Form
						</h2>
						<p className='mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base'>
							Complete this form to begin the corporate onboarding process. Your
							information will be reviewed by the Enusha team.
						</p>
					</div>
					<OnboardingForm />
				</div>
			</div>
		</section>
	)
}
