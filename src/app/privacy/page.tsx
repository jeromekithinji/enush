import type { Metadata } from 'next'

import { PrivacyNotice } from '@/components/legal/privacy-notice'

export const metadata: Metadata = {
	title: 'Privacy Notice',
}

export default function PrivacyPage () {
	return <PrivacyNotice />
}
