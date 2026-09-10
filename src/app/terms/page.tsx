import type { Metadata } from 'next'

import { StubPage } from '@/components/layout/stub-page'

export const metadata: Metadata = {
	title: 'Terms of Use',
}

export default function TermsPage () {
	return (
		<StubPage
			title='Terms of Use'
			description='The official Terms of Use will be published here before launch. This page is a placeholder and is not a legal document.'
		/>
	)
}
