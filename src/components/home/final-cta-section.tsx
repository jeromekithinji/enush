import { HashLink } from '@/components/layout/hash-link'
import { Button } from '@/components/ui/button'
import { primaryCta } from '@/lib/nav'
import { SUPPORT_EMAIL } from '@/lib/site'

export function FinalCtaSection () {
	return (
		<section
			id='get-started'
			aria-labelledby='final-cta-heading'
			className='bg-charcoal'
		>
			<div className='mx-auto flex w-full max-w-[800px] flex-col items-center px-5 py-16 text-center md:px-8 lg:py-24'>
				<h2
					id='final-cta-heading'
					className='font-heading text-[1.85rem] font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.5rem]'
				>
					Ready to help your employees thrive financially?
				</h2>
				<p className='mt-4 max-w-2xl text-base leading-7 text-zinc-300 sm:text-[1.05rem] sm:leading-8'>
					Partner with Enusha to provide responsible, accessible, and timely
					financial solutions—supported by practical financial wellness
					education.
				</p>
				<div className='mt-8 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center'>
					<Button
						asChild
						className='h-12 w-full rounded-md bg-brand px-6 text-sm font-semibold text-white hover:bg-brand/90 sm:w-auto'
					>
						<HashLink href={primaryCta.href}>{primaryCta.label}</HashLink>
					</Button>
					<Button
						asChild
						variant='outline'
						className='h-12 w-full rounded-md border-white bg-transparent px-6 text-sm font-semibold text-white hover:bg-white/10 hover:text-white sm:w-auto'
					>
						<a href={`mailto:${SUPPORT_EMAIL}`}>Speak to the Enusha Team</a>
					</Button>
				</div>
			</div>
		</section>
	)
}
