'use client'

import Link from 'next/link'

interface HashLinkProps {
	href: string
	className?: string
	children: React.ReactNode
	onNavigate?: () => void
}

export function HashLink ({
	href,
	className,
	children,
	onNavigate,
}: HashLinkProps) {
	function handleClick () {
		onNavigate?.()

		if (href.startsWith('/#')) {
			const id = href.slice(2)
			window.setTimeout(() => {
				document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
			}, 50)
		}
	}

	return (
		<Link href={href} onClick={handleClick} className={className}>
			{children}
		</Link>
	)
}
