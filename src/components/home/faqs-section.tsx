'use client'

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { faqs } from '@/lib/faqs'

export function FaqsSection () {
	return (
		<section
			id='faqs'
			aria-labelledby='faqs-heading'
			className='bg-cream'
		>
			<div className='mx-auto w-full max-w-[800px] px-5 py-14 md:px-8 lg:py-20'>
				<h2
					id='faqs-heading'
					className='text-left font-heading text-[1.85rem] font-semibold tracking-tight text-charcoal sm:text-4xl md:text-center'
				>
					Frequently asked questions
				</h2>

				<Accordion
					type='single'
					collapsible
					defaultValue={faqs[0]?.id}
					className='mt-10 md:mt-12'
				>
					{faqs.map((faq) => (
						<AccordionItem
							key={faq.id}
							value={faq.id}
							className='border-zinc-200'
						>
							<AccordionTrigger className='rounded-none py-5 text-left text-base font-semibold text-charcoal hover:no-underline **:data-[slot=accordion-trigger-icon]:text-zinc-400 aria-expanded:**:data-[slot=accordion-trigger-icon]:text-brand'>
								{faq.question}
							</AccordionTrigger>
							<AccordionContent className='pb-5 text-base leading-7 text-muted-foreground'>
								<p>{faq.answer}</p>
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</section>
	)
}
