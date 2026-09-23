import type { Metadata } from 'next'

import { LegalPolicies } from '@/components/legal/legal-policies'
import { ScrollToHash } from '@/components/legal/scroll-to-hash'

export const metadata: Metadata = {
	title: 'Legal',
}

export default function TermsPage () {
	return (
		<>
			<ScrollToHash />
			<LegalPolicies />
		</>
	)
}
