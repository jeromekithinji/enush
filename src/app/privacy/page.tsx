import type { Metadata } from 'next'

import { StubPage } from '@/components/layout/stub-page'

export const metadata: Metadata = {
	title: 'Privacy Notice',
}

export default function PrivacyPage () {
	return (
		<StubPage
			title='Privacy Notice'
			description='The official Privacy Notice will be published here before launch. This page is a placeholder and is not a legal document.'
		/>
	)
}
