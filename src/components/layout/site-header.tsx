'use client'

import { useCallback, useEffect, useId, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { BrandLogo } from '@/components/layout/brand-logo'
import { HashLink } from '@/components/layout/hash-link'
import { navItems, primaryCta } from '@/lib/nav'
import { cn } from '@/lib/utils'

export function SiteHeader () {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const menuId = useId()

	const handleCloseMenu = useCallback(() => {
		setIsMenuOpen(false)
	}, [])

	function handleNavClick (href: string) {
		handleCloseMenu()

		if (href.startsWith('/#')) {
			const id = href.slice(2)
			window.setTimeout(() => {
				document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
			}, 50)
		}
	}

	useEffect(() => {
		function handleKeyDown (event: KeyboardEvent) {
			if (event.key === 'Escape') {
				setIsMenuOpen(false)
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [])

	return (
		<header className='sticky top-0 z-50 bg-white'>
			<div className='mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-5 py-3 md:px-8 lg:px-10 lg:py-4'>
				<BrandLogo showTagline />

				<nav
					aria-label='Primary'
					className='hidden items-center gap-3 xl:flex xl:gap-4 2xl:gap-5'
				>
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							onClick={() => handleNavClick(item.href)}
							className='whitespace-nowrap text-[13px] text-charcoal transition-colors hover:text-brand xl:text-sm'
						>
							{item.label}
						</Link>
					))}
				</nav>

				<Button
					asChild
					className='hidden h-10 rounded-md px-4 text-[13px] font-semibold xl:inline-flex'
				>
					<HashLink href={primaryCta.href}>{primaryCta.label}</HashLink>
				</Button>

				<button
					type='button'
					className='inline-flex size-9 items-center justify-center rounded-md text-charcoal xl:hidden'
					aria-expanded={isMenuOpen}
					aria-controls={menuId}
					aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
					onClick={() => setIsMenuOpen((open) => !open)}
				>
					{isMenuOpen ? (
						<span className='flex size-9 items-center justify-center rounded-md bg-zinc-100'>
							<X className='size-5' aria-hidden='true' />
						</span>
					) : (
						<Menu className='size-6' aria-hidden='true' />
					)}
				</button>
			</div>

			<div
				id={menuId}
				className={cn(
					'border-t border-transparent bg-white xl:hidden',
					isMenuOpen && 'border-zinc-100',
				)}
				hidden={!isMenuOpen}
			>
				<nav
					aria-label='Mobile'
					className='mx-auto flex w-full max-w-[1280px] flex-col px-5 pb-6 pt-2 md:px-8'
				>
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							onClick={() => handleNavClick(item.href)}
							className='py-3.5 text-base text-charcoal'
						>
							{item.label}
						</Link>
					))}
					<Button
						asChild
						className='mt-5 h-12 w-full rounded-md text-base font-semibold'
					>
						<HashLink href={primaryCta.href} onNavigate={handleCloseMenu}>
							{primaryCta.label}
						</HashLink>
					</Button>
				</nav>
			</div>
		</header>
	)
}
