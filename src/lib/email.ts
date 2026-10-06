import {
	COMPANY_NAME,
	SUPPORT_EMAIL,
	SUPPORT_TELEPHONE,
	TEAM_NOTIFICATION_EMAILS,
} from '@/lib/site'
import type { EnquiryValues } from '@/lib/enquiry/schema'
import type { OnboardFormValues } from '@/lib/onboard/schema'

interface EmailAttachment {
	filename: string
	content: string
}

function escapeHtml (value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
}

function row (label: string, value: string) {
	const display = value.trim() ? escapeHtml(value) : '—'
	return `<tr>
		<td style="padding:8px 16px 8px 0;color:#6b6b70;vertical-align:top;white-space:nowrap;font-size:14px;">${escapeHtml(label)}</td>
		<td style="padding:8px 0;color:#1a1a1a;font-size:14px;">${display}</td>
	</tr>`
}

function textRow (label: string, value: string) {
	return `${label}: ${value.trim() ? value : '—'}`
}

function formatSubmittedAt (iso: string) {
	const date = new Date(iso)
	if (Number.isNaN(date.getTime())) {
		return iso
	}

	const parts = new Intl.DateTimeFormat('en-GB', {
		timeZone: 'Africa/Nairobi',
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	}).formatToParts(date)

	const get = (type: Intl.DateTimeFormatPartTypes) =>
		parts.find((part) => part.type === type)?.value ?? ''

	return `Date ${get('day')}/${get('month')}/${get('year')} and time ${get('hour')}:${get('minute')}`
}

function wrapHtml (title: string, body: string) {
	return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#fff9f0;font-family:Arial,sans-serif;">
	<div style="max-width:600px;margin:0 auto;padding:24px;">
		<p style="margin:0 0 16px;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#f58220;font-weight:700;">${escapeHtml(COMPANY_NAME)}</p>
		<h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#1a1a1a;">${escapeHtml(title)}</h1>
		${body}
		<p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#6b6b70;">
			${escapeHtml(COMPANY_NAME)}<br>
			Email: ${escapeHtml(SUPPORT_EMAIL)}<br>
			Telephone: ${escapeHtml(SUPPORT_TELEPHONE)}
		</p>
	</div>
</body>
</html>`
}

async function sendEmail (input: {
	to: string | string[]
	subject: string
	text: string
	html: string
	replyTo?: string
	attachments?: EmailAttachment[]
}): Promise<boolean> {
	const apiKey = process.env.RESEND_API_KEY
	if (!apiKey) {
		console.error('RESEND_API_KEY is not set; email was not sent')
		return false
	}

	const from = process.env.EMAIL_FROM ?? `${COMPANY_NAME} <${SUPPORT_EMAIL}>`

	try {
		const response = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				authorization: `Bearer ${apiKey}`,
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				from,
				to: Array.isArray(input.to) ? input.to : [input.to],
				subject: input.subject,
				text: input.text,
				html: input.html,
				reply_to: input.replyTo,
				attachments: input.attachments,
			}),
		})

		if (!response.ok) {
			const detail = await response.text()
			console.error('Failed to send email', response.status, detail)
			return false
		}

		return true
	} catch (error) {
		console.error('Failed to send email', error)
		return false
	}
}

function teamInbox () {
	const extra = (process.env.TEAM_NOTIFICATION_EMAIL ?? '')
		.split(',')
		.map((email) => email.trim())
		.filter(Boolean)

	return [...new Set([...TEAM_NOTIFICATION_EMAILS, ...extra])]
}

export async function notifyEnquirySubmitted (input: {
	reference: string
	submittedAt: string
	payload: EnquiryValues
}): Promise<boolean> {
	const { reference, submittedAt, payload } = input
	const [teamSent, clientSent] = await Promise.all([
		sendEmail({
			to: teamInbox(),
			subject: `New Enusha enquiry ${reference}`,
			replyTo: payload.email,
			text: [
				'A new Speak to the Enusha Team enquiry was submitted.',
				'',
				textRow('Reference', reference),
				textRow('Submitted', submittedAt),
				textRow('Name', payload.name),
				textRow('Email', payload.email),
				textRow('Phone', payload.phone),
				textRow('Request', payload.request),
			].join('\n'),
			html: wrapHtml(
				'New enquiry',
				`<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#1a1a1a;">A new Speak to the Enusha Team enquiry was submitted.</p>
				<table>${row('Reference', reference)}${row('Submitted', submittedAt)}${row('Name', payload.name)}${row('Email', payload.email)}${row('Phone', payload.phone)}</table>
				<p style="margin:16px 0 6px;color:#6b6b70;font-size:14px;">Request</p>
				<p style="white-space:pre-wrap;margin:0;font-size:15px;line-height:1.6;color:#1a1a1a;">${escapeHtml(payload.request)}</p>`,
			),
			attachments: [
				{
					filename: `${reference}.json`,
					content: Buffer.from(JSON.stringify(input, null, 2)).toString('base64'),
				},
			],
		}),
		sendEmail({
			to: payload.email,
			subject: 'We received your enquiry — Enusha Capital',
			replyTo: SUPPORT_EMAIL,
			text: [
				`Dear ${payload.name},`,
				'',
				'Thank you for contacting Enusha Capital. We have received your enquiry and a member of the team will get back to you shortly.',
				'',
				'Contact us if you want any further information.',
				'',
				'Kind regards,',
				'The Enusha Capital team',
			].join('\n'),
			html: wrapHtml(
				'We received your enquiry',
				`<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#1a1a1a;">Dear ${escapeHtml(payload.name)},</p>
				<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#1a1a1a;">Thank you for contacting Enusha Capital. We have received your enquiry and a member of the team will get back to you shortly.</p>
				<p style="margin:16px 0 0;font-size:15px;line-height:1.6;color:#1a1a1a;">Contact us if you want any further information.</p>
				<p style="margin:16px 0 0;font-size:15px;line-height:1.6;color:#1a1a1a;">Kind regards,<br>The Enusha Capital team</p>`,
			),
		}),
	])

	return teamSent && clientSent
}

export async function notifyOnboardingSubmitted (input: {
	reference: string
	submittedAt: string
	payload: OnboardFormValues
	documentNames: string[]
}): Promise<boolean> {
	const { reference, submittedAt, payload, documentNames } = input
	const documents = documentNames.length > 0
		? documentNames.join(', ')
		: 'None listed'
	const products = payload.stability.requestedProducts.join(', ')
	const declarant = `${payload.declaration.fullName} (${payload.declaration.jobTitle})`
	const submittedDisplay = formatSubmittedAt(submittedAt)

	const [teamSent, clientSent] = await Promise.all([
		sendEmail({
			to: teamInbox(),
			subject: `New corporate onboarding ${reference} — ${payload.company.registeredName}`,
			replyTo: payload.declaration.email,
			text: [
				'A new Corporate Check-Off Onboarding Form was submitted.',
				'',
				textRow('Reference', reference),
				textRow('Submitted', submittedDisplay),
				textRow('Company', payload.company.registeredName),
				textRow('Trading name', payload.company.tradingName),
				textRow('Registration number', payload.company.registrationNumber),
				textRow('KRA PIN', payload.company.kraPin),
				textRow('Industry', payload.company.industry),
				textRow('County', payload.address.county),
				textRow('Declarant', declarant),
				textRow('Declarant email', payload.declaration.email),
				textRow('Requested products', products),
				textRow('Documents', documents),
			].join('\n'),
			html: wrapHtml(
				'New corporate onboarding',
				`<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#1a1a1a;">A new Corporate Check-Off Onboarding Form was submitted.</p>
				<table>
					${row('Reference', reference)}
					${row('Submitted', submittedDisplay)}
					${row('Company', payload.company.registeredName)}
					${row('Trading name', payload.company.tradingName)}
					${row('Registration number', payload.company.registrationNumber)}
					${row('KRA PIN', payload.company.kraPin)}
					${row('Industry', payload.company.industry)}
					${row('County', payload.address.county)}
					${row('Declarant', declarant)}
					${row('Declarant email', payload.declaration.email)}
					${row('Requested products', products)}
					${row('Documents', documents)}
				</table>`,
			),
			attachments: [
				{
					filename: `${reference}.json`,
					content: Buffer.from(JSON.stringify({
						reference,
						submittedAt,
						payload,
						documents: documentNames,
					}, null, 2)).toString('base64'),
				},
			],
		}),
		sendEmail({
			to: payload.declaration.email,
			subject: `We received your onboarding form ${reference} — Enusha Capital`,
			replyTo: SUPPORT_EMAIL,
			text: [
				`Dear ${payload.declaration.fullName},`,
				'',
				`Thank you for submitting the Corporate Check-Off Onboarding Form for ${payload.company.registeredName}. We have received your information and the Enusha team will review it shortly.`,
				'',
				'Submission does not constitute approval or activation of the scheme.',
				'',
				'Contact us if you want any further information.',
				'',
				'Kind regards,',
				'The Enusha Capital team',
			].join('\n'),
			html: wrapHtml(
				'We received your onboarding form',
				`<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#1a1a1a;">Dear ${escapeHtml(payload.declaration.fullName)},</p>
				<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#1a1a1a;">Thank you for submitting the Corporate Check-Off Onboarding Form for <strong>${escapeHtml(payload.company.registeredName)}</strong>. We have received your information and the Enusha team will review it shortly.</p>
				<p style="margin:16px 0 0;font-size:15px;line-height:1.6;color:#1a1a1a;">Submission does not constitute approval or activation of the scheme.</p>
				<p style="margin:16px 0 0;font-size:15px;line-height:1.6;color:#1a1a1a;">Contact us if you want any further information.</p>
				<p style="margin:16px 0 0;font-size:15px;line-height:1.6;color:#1a1a1a;">Kind regards,<br>The Enusha Capital team</p>`,
			),
		}),
	])

	return teamSent && clientSent
}
