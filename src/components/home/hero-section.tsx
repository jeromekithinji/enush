import Image from 'next/image'
import Link from 'next/link'

import { HashLink } from '@/components/layout/hash-link'
import { Button } from '@/components/ui/button'
import { primaryCta, secondaryCta } from '@/lib/nav'

export function HeroSection () {
	return (
		<section className='overflow-x-hidden bg-white'>
			<div className='mx-auto grid w-full max-w-[1280px] items-center gap-10 px-5 py-10 md:px-8 lg:grid-cols-2 lg:gap-12 lg:px-10 lg:py-16'>
				<div className='flex flex-col'>
					<h1 className='font-heading text-[2rem] font-semibold leading-[1.15] tracking-tight text-charcoal sm:text-4xl lg:text-[2.75rem] xl:text-[3.15rem]'>
						Supporting Your Financial Needs Today. Strengthening Your Tomorrow.
					</h1>
					<p className='mt-5 max-w-xl text-base leading-7 text-muted-foreground lg:text-[1.05rem] lg:leading-8'>
						Enusha Capital partners with trusted partners to provide eligible
						employees with convenient access to responsible payroll check-off
						loans for everyday needs, important milestones and unexpected
						expenses—supported by practical financial wellness programs.
					</p>
					<div className='mt-7 flex w-full flex-col gap-3 lg:flex-row lg:items-center'>
						<Button
							asChild
							className='h-12 w-full rounded-md px-6 text-sm font-semibold lg:w-auto'
						>
							<HashLink href={primaryCta.href}>{primaryCta.label}</HashLink>
						</Button>
						<Button
							asChild
							variant='outline'
							className='h-12 w-full rounded-md border-charcoal px-6 text-sm font-semibold text-charcoal hover:bg-zinc-50 lg:w-auto'
						>
							<Link href={secondaryCta.href}>{secondaryCta.label}</Link>
						</Button>
					</div>
					<p className='mt-8 max-w-md border-l-[3px] border-brand pl-4 text-sm leading-6 text-muted-foreground'>
						Simple payroll deductions. Same-day disbursement for approved
						employee applications. No collateral required.
					</p>
				</div>

				<div className='relative mx-auto w-full max-w-xl lg:max-w-none'>
					<div
						aria-hidden='true'
						className='absolute -top-6 -right-4 size-28 rounded-full bg-brand/25 sm:-top-8 sm:-right-8 sm:size-36'
					/>
					<div
						aria-hidden='true'
						className='absolute -bottom-6 -left-4 size-24 rounded-full bg-brand/20 sm:-bottom-8 sm:-left-8 sm:size-32'
					/>
					<div className='relative overflow-hidden rounded-[1.5rem] shadow-[0_18px_40px_rgba(0,0,0,0.12)]'>
						<Image
							src='/images/hero-professionals.jpg'
							alt='Three professionals collaborating around a laptop in a modern office'
							width={1024}
							height={682}
							className='h-auto w-full object-cover'
							priority
						/>
					</div>
				</div>
			</div>
		</section>
	)
}
