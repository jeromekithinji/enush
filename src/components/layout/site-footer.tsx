import Image from 'next/image'
import Link from 'next/link'

import {
	COMPANY_ADDRESS_LINES,
	COMPANY_NAME,
	SUPPORT_EMAIL,
	SUPPORT_TELEPHONE,
	TAGLINE,
	legalNavItems,
	lendingDisclaimer,
} from '@/lib/site'

export function SiteFooter () {
	return (
		<footer id='contact' className='bg-charcoal text-white'>
			<div className='border-t border-white/10'>
				<div className='mx-auto grid w-full max-w-[1280px] gap-10 px-5 py-12 md:px-8 lg:grid-cols-3 lg:gap-16 lg:px-10 lg:py-16'>
					<div>
						<Link
							href='/'
							aria-label={COMPANY_NAME}
							className='inline-flex items-center gap-3'
						>
							<span className='inline-flex shrink-0 rounded-md bg-white px-2.5 py-2'>
								<Image
									src='/images/enusha-logo.png'
									alt=''
									width={230}
									height={128}
									className='h-10 w-auto'
								/>
							</span>
							<span className='flex flex-col'>
								<span className='font-heading text-xl font-semibold leading-tight text-white sm:text-2xl'>
									{COMPANY_NAME}
								</span>
								<span className='mt-1 text-sm font-semibold italic text-brand sm:text-base'>
									{TAGLINE}
								</span>
							</span>
						</Link>
						<p className='mt-4 text-sm leading-6 text-zinc-400'>
							{COMPANY_ADDRESS_LINES.map((line) => (
								<span key={line} className='block'>
									{line}
								</span>
							))}
						</p>
						<div className='mt-6 border-t border-white/15 pt-6'>
							<div className='inline-flex rounded-md bg-white px-2.5 py-1.5'>
								<Image
									src='/images/finsmart-logo.jpg'
									alt='FinSmart'
									width={1024}
									height={345}
									className='h-8 w-auto'
								/>
							</div>
						</div>
					</div>

					<div>
						<h2 className='text-sm font-semibold tracking-[0.16em] text-white uppercase'>
							Contact
						</h2>
						<dl className='mt-4 space-y-3 text-sm leading-6'>
							<div>
								<dt className='inline text-zinc-400'>Email: </dt>
								<dd className='inline'>
									<a
										href={`mailto:${SUPPORT_EMAIL}`}
										className='text-brand hover:underline'
									>
										{SUPPORT_EMAIL}
									</a>
								</dd>
							</div>
							<div>
								<dt className='inline text-zinc-400'>Telephone: </dt>
								<dd className='inline text-brand'>{SUPPORT_TELEPHONE}</dd>
							</div>
							<div>
								<dt className='inline text-zinc-400'>Customer Support: </dt>
								<dd className='inline'>
									<a
										href={`mailto:${SUPPORT_EMAIL}`}
										className='text-brand hover:underline'
									>
										{SUPPORT_EMAIL}
									</a>
								</dd>
							</div>
						</dl>
					</div>

					<nav aria-label='Legal'>
						<h2 className='text-sm font-semibold tracking-[0.16em] text-white uppercase'>
							Legal
						</h2>
						<ul className='mt-4 space-y-3 text-sm'>
							{legalNavItems.map((item) => (
								<li key={item.href}>
									<Link
										href={item.href}
										className='text-zinc-400 transition-colors hover:text-white'
									>
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				</div>
			</div>

			<div className='border-t border-white/10'>
				<div className='mx-auto w-full max-w-[1280px] px-5 py-8 md:px-8 lg:px-10'>
					<p className='text-center text-xs text-zinc-500'>
						© 2026 {COMPANY_NAME}. All rights reserved.
					</p>
					<p className='mx-auto mt-6 max-w-4xl rounded-xl bg-white/5 px-5 py-4 text-center text-xs leading-5 text-zinc-400 sm:px-8 sm:leading-6'>
						{lendingDisclaimer}
					</p>
				</div>
			</div>
		</footer>
	)
}
