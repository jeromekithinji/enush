import type { Metadata } from 'next'

import { StubPage } from '@/components/layout/stub-page'

export const metadata: Metadata = {
	title: 'Corporate Benefits',
}

export default function CorporateBenefitsPage () {
	return (
		<StubPage
			title='Corporate Benefits'
			description='Benefits of partnering with Enusha Capital for your organisation.'
		/>
	)
}
