import type { Metadata } from 'next'

import { StubPage } from '@/components/layout/stub-page'

export const metadata: Metadata = {
	title: 'Complaints & Customer Support',
}

export default function ComplaintsPage () {
	return (
		<StubPage
			title='Complaints & Customer Support'
			description='The official complaints and customer support process will be published here before launch. This page is a placeholder and is not a legal document.'
		/>
	)
}
