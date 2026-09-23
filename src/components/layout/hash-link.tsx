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

		const hashIndex = href.indexOf('#')
		if (hashIndex === -1) {
			return
		}

		const id = href.slice(hashIndex + 1)
		if (!id) {
			return
		}

		window.setTimeout(() => {
			document.getElementById(id)?.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			})
		}, 80)
	}

	return (
		<Link href={href} onClick={handleClick} className={className}>
			{children}
		</Link>
	)
}
