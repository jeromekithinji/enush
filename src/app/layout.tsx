import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Source_Serif_4 } from 'next/font/google'

import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
	variable: '--font-plus-jakarta',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
})

const sourceSerif = Source_Serif_4({
	variable: '--font-source-serif',
	subsets: ['latin'],
	weight: ['600', '700'],
	style: ['normal', 'italic'],
})

export const metadata: Metadata = {
	title: {
		default: 'Enusha Capital',
		template: '%s | Enusha Capital',
	},
	description:
		'Enusha Capital partners with employers to provide eligible employees with responsible payroll check-off loans.',
	icons: {
		icon: '/images/enusha-logo.png',
	},
}

export default function RootLayout ({
	children,
}: LayoutProps<'/'>) {
	return (
		<html
			lang='en'
			className={`${plusJakarta.variable} ${sourceSerif.variable} h-full antialiased`}
		>
			<body className='flex min-h-full flex-col bg-white font-sans text-foreground'>
				<a
					href='#main-content'
					className='sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-brand focus:px-3 focus:py-2 focus:text-white'
				>
					Skip to content
				</a>
				<SiteHeader />
				<main id='main-content' className='flex-1'>
					{children}
				</main>
				<SiteFooter />
			</body>
		</html>
	)
}
