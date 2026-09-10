interface StubPageProps {
	title: string
	description: string
}

export function StubPage ({ title, description }: StubPageProps) {
	return (
		<section className='mx-auto w-full max-w-[1280px] px-5 py-16 md:px-8 lg:px-10'>
			<h1 className='font-heading text-3xl font-semibold tracking-tight text-charcoal md:text-4xl'>
				{title}
			</h1>
			<p className='mt-4 max-w-2xl text-base leading-7 text-muted-foreground'>
				{description}
			</p>
		</section>
	)
}
