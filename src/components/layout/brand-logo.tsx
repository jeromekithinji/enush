import Image from 'next/image'
import Link from 'next/link'

interface BrandLogoProps {
	showTagline?: boolean
}

export function BrandLogo ({ showTagline = false }: BrandLogoProps) {
	return (
		<Link href='/' className='flex flex-col items-start'>
			<Image
				src='/images/enusha-logo.png'
				alt='Enusha Capital Ltd'
				width={230}
				height={128}
				className='h-11 w-auto lg:h-12'
				priority
			/>
			{showTagline ? (
				<span className='mt-0.5 hidden text-[11px] tracking-wide text-brand-gray xl:block'>
					Loans Bila Stress
				</span>
			) : null}
		</Link>
	)
}
