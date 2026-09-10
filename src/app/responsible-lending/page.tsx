import type { Metadata } from 'next'

import { StubPage } from '@/components/layout/stub-page'

export const metadata: Metadata = {
	title: 'Responsible Lending',
}

export default function ResponsibleLendingPage () {
	return (
		<StubPage
			title='Responsible Lending'
			description='The official responsible lending statement will be published here before launch. This page is a placeholder and is not a legal document.'
		/>
	)
}
