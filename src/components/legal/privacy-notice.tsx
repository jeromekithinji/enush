import {
	COMPANY_ADDRESS,
	COMPANY_NAME,
	SUPPORT_EMAIL,
	SUPPORT_TELEPHONE,
} from '@/lib/site'

const LAST_UPDATED = '23 September 2026'

export function PrivacyNotice () {
	return (
		<div className='mx-auto w-full max-w-3xl px-5 py-14 md:px-8 lg:px-10 lg:py-20'>
			<p className='text-xs font-semibold tracking-[0.18em] text-brand uppercase'>
				Legal
			</p>
			<h1 className='mt-3 font-heading text-3xl font-semibold tracking-tight text-charcoal md:text-4xl'>
				Privacy Notice
			</h1>
			<p className='mt-3 text-sm text-muted-foreground'>
				Last Updated: {LAST_UPDATED}
			</p>

			<div className='mt-10 space-y-10 text-base leading-7 text-muted-foreground'>
				<section aria-labelledby='privacy-introduction'>
					<h2
						id='privacy-introduction'
						className='font-heading text-2xl font-semibold tracking-tight text-charcoal'
					>
						Introduction
					</h2>
					<p className='mt-4'>
						This Privacy Policy describes how {COMPANY_NAME} (“we,” “us,” or
						“our”) collects, uses, and discloses your personal information when
						you visit, interact with our services, make a transaction through
						our platforms, or communicate with us (collectively, the
						“Services”). The terms “you” and “your” refer to any user of our
						Services—whether a customer, website visitor, or another individual
						whose information we collect.
					</p>
					<p className='mt-4'>
						We may update this Privacy Policy from time to time. Any changes
						will be posted on our website with an updated “Last Updated” date.
						Please review this policy regularly to stay informed.
					</p>
				</section>

				<section aria-labelledby='privacy-collect'>
					<h2
						id='privacy-collect'
						className='font-heading text-2xl font-semibold tracking-tight text-charcoal'
					>
						1. Personal Information We Collect
					</h2>

					<h3 className='mt-6 font-heading text-lg font-semibold text-charcoal'>
						Information You Provide Directly
					</h3>
					<p className='mt-3'>
						When you interact with our Services, you may provide us with
						personal information such as:
					</p>
					<ul className='mt-3 list-disc space-y-2 pl-5'>
						<li>
							<span className='font-medium text-charcoal'>Contact Details:</span>{' '}
							Name, address, email, phone number, and identification
							information.
						</li>
						<li>
							<span className='font-medium text-charcoal'>
								Transaction Information:
							</span>{' '}
							Loan applications, disbursement details, repayment records, and
							payment confirmation.
						</li>
						<li>
							<span className='font-medium text-charcoal'>
								Account Information:
							</span>{' '}
							Login credentials, security questions, and communication
							preferences.
						</li>
						<li>
							<span className='font-medium text-charcoal'>
								Customer Support Information:
							</span>{' '}
							Details you share when reaching out for support or inquiries.
						</li>
					</ul>
					<p className='mt-4'>
						Certain features may require specific information to be provided.
						Choosing not to provide this information may limit your access to
						some of our services.
					</p>

					<h3 className='mt-6 font-heading text-lg font-semibold text-charcoal'>
						Information We Collect Automatically
					</h3>
					<p className='mt-3'>
						We may collect the following information automatically:
					</p>
					<ul className='mt-3 list-disc space-y-2 pl-5'>
						<li>
							<span className='font-medium text-charcoal'>Usage Data:</span> IP
							address, browser type, device identifiers, and interaction data
							from our website or platforms.
						</li>
						<li>
							<span className='font-medium text-charcoal'>
								Cookies and Similar Technologies:
							</span>{' '}
							We use cookies, beacons, and other technologies to enhance your
							experience and analyze service usage. You can manage cookies via
							your browser settings.
						</li>
					</ul>

					<h3 className='mt-6 font-heading text-lg font-semibold text-charcoal'>
						Information from Third Parties
					</h3>
					<p className='mt-3'>We may receive information about you from:</p>
					<ul className='mt-3 list-disc space-y-2 pl-5'>
						<li>
							<span className='font-medium text-charcoal'>
								Service Providers:
							</span>{' '}
							Loan management systems, mobile payment providers, credit bureaus,
							and analytics platforms.
						</li>
						<li>
							<span className='font-medium text-charcoal'>
								Marketing Partners:
							</span>{' '}
							Organizations that help us reach you with relevant financial
							offers and updates.
						</li>
					</ul>
					<p className='mt-4'>
						All third-party information is handled in accordance with this
						Privacy Policy.
					</p>
				</section>

				<section aria-labelledby='privacy-use'>
					<h2
						id='privacy-use'
						className='font-heading text-2xl font-semibold tracking-tight text-charcoal'
					>
						2. How We Use Your Personal Information
					</h2>
					<p className='mt-4'>We use the personal data we collect to:</p>
					<ul className='mt-3 list-disc space-y-2 pl-5'>
						<li>
							<span className='font-medium text-charcoal'>
								Deliver Financial Services:
							</span>{' '}
							Process applications, manage loans, facilitate repayments, and
							offer customer support.
						</li>
						<li>
							<span className='font-medium text-charcoal'>
								Improve and Develop Services:
							</span>{' '}
							Enhance user experience and develop new products.
						</li>
						<li>
							<span className='font-medium text-charcoal'>
								Marketing and Communication:
							</span>{' '}
							Send you relevant updates, promotions, and service-related
							messages where you have provided your consent or where permitted
							by applicable law. You may opt out of receiving marketing
							communications at any time through the provided channels.
						</li>
						<li>
							<span className='font-medium text-charcoal'>
								Security and Compliance:
							</span>{' '}
							Prevent fraud, verify identities, and comply with regulatory
							requirements.
						</li>
					</ul>
				</section>

				<section aria-labelledby='privacy-share'>
					<h2
						id='privacy-share'
						className='font-heading text-2xl font-semibold tracking-tight text-charcoal'
					>
						3. How We Share Your Personal Information
					</h2>
					<p className='mt-4'>
						We may share your personal information with:
					</p>
					<ul className='mt-3 list-disc space-y-2 pl-5'>
						<li>
							<span className='font-medium text-charcoal'>
								Service Providers and Vendors:
							</span>{' '}
							Including credit reference bureaus, IT service providers, payment
							partners, and cloud storage services.
						</li>
						<li>
							<span className='font-medium text-charcoal'>
								Business and Marketing Partners:
							</span>{' '}
							That assist us in outreach and customer engagement.
						</li>
						<li>
							<span className='font-medium text-charcoal'>
								Affiliated Companies:
							</span>{' '}
							Within the Enusha Capital group for business purposes.
						</li>
						<li>
							<span className='font-medium text-charcoal'>
								Legal and Regulatory Authorities:
							</span>{' '}
							Where required to comply with applicable laws or protect our legal
							interests.
						</li>
					</ul>
					<p className='mt-4'>
						We do not sell or share personal data as defined under applicable
						data protection laws.
					</p>
				</section>

				<section aria-labelledby='privacy-retention'>
					<h2
						id='privacy-retention'
						className='font-heading text-2xl font-semibold tracking-tight text-charcoal'
					>
						4. Data Retention
					</h2>
					<p className='mt-4'>
						We retain personal data only as long as necessary for the purposes
						outlined, including meeting legal, regulatory, and accounting
						obligations.
					</p>
				</section>

				<section aria-labelledby='privacy-rights'>
					<h2
						id='privacy-rights'
						className='font-heading text-2xl font-semibold tracking-tight text-charcoal'
					>
						5. Your Rights
					</h2>
					<p className='mt-4'>
						Depending on your jurisdiction, you may have the right to:
					</p>
					<ul className='mt-3 list-disc space-y-2 pl-5'>
						<li>
							<span className='font-medium text-charcoal'>Access / Know:</span>{' '}
							Request a copy of the personal data we hold.
						</li>
						<li>
							<span className='font-medium text-charcoal'>Delete:</span> Ask for
							your data to be erased.
						</li>
						<li>
							<span className='font-medium text-charcoal'>Correct:</span> Fix
							inaccuracies in your information.
						</li>
						<li>
							<span className='font-medium text-charcoal'>
								Data Portability:
							</span>{' '}
							Receive your data in a portable format.
						</li>
						<li>
							<span className='font-medium text-charcoal'>
								Restrict Processing:
							</span>{' '}
							Limit the use of your personal information.
						</li>
						<li>
							<span className='font-medium text-charcoal'>
								Withdraw Consent:
							</span>{' '}
							Where processing is based on consent.
						</li>
						<li>
							<span className='font-medium text-charcoal'>
								Marketing Preferences:
							</span>{' '}
							Opt out of marketing communications. Transactional messages will
							still be sent.
						</li>
					</ul>
					<p className='mt-4'>
						To exercise these rights, please contact us via the details provided
						below. We may require identity verification before acting on your
						request.
					</p>
				</section>

				<section aria-labelledby='privacy-security'>
					<h2
						id='privacy-security'
						className='font-heading text-2xl font-semibold tracking-tight text-charcoal'
					>
						6. Security Measures
					</h2>
					<p className='mt-4'>
						We use technical and organizational safeguards to protect your data.
						However, no system is 100% secure. Please avoid sharing sensitive
						information over unsecured channels.
					</p>
				</section>

				<section aria-labelledby='privacy-third-parties'>
					<h2
						id='privacy-third-parties'
						className='font-heading text-2xl font-semibold tracking-tight text-charcoal'
					>
						7. Third-Party Websites and Links
					</h2>
					<p className='mt-4'>
						Our website may contain links to external websites not governed by
						this policy. We encourage you to review their privacy practices
						before sharing any personal information.
					</p>
				</section>

				<section aria-labelledby='privacy-children'>
					<h2
						id='privacy-children'
						className='font-heading text-2xl font-semibold tracking-tight text-charcoal'
					>
						8. Children’s Data
					</h2>
					<p className='mt-4'>
						Our services are not intended for individuals under 18. We do not
						knowingly collect personal data from minors. If you believe a minor
						has submitted personal information, please contact us so we can
						delete it.
					</p>
				</section>

				<section aria-labelledby='privacy-transfers'>
					<h2
						id='privacy-transfers'
						className='font-heading text-2xl font-semibold tracking-tight text-charcoal'
					>
						9. International Data Transfers
					</h2>
					<p className='mt-4'>
						If we transfer your data outside your home country, we use legally
						approved safeguards such as Standard Contractual Clauses to ensure
						data protection.
					</p>
				</section>

				<section aria-labelledby='privacy-contact'>
					<h2
						id='privacy-contact'
						className='font-heading text-2xl font-semibold tracking-tight text-charcoal'
					>
						10. Contact Information
					</h2>
					<p className='mt-4'>
						If you have any questions about this Privacy Policy, need
						assistance, or wish to exercise your rights, please contact:
					</p>
					<dl className='mt-4 space-y-2'>
						<div>
							<dt className='inline font-medium text-charcoal'>Email: </dt>
							<dd className='inline'>
								<a
									href={`mailto:${SUPPORT_EMAIL}`}
									className='text-brand hover:underline'
								>
									{SUPPORT_EMAIL}
								</a>
							</dd>
						</div>
						<div>
							<dt className='inline font-medium text-charcoal'>Address: </dt>
							<dd className='inline'>
								{COMPANY_NAME}, {COMPANY_ADDRESS}
							</dd>
						</div>
						<div>
							<dt className='inline font-medium text-charcoal'>
								Telephone:{' '}
							</dt>
							<dd className='inline'>
								<a
									href={`tel:${SUPPORT_TELEPHONE.replace(/\s/g, '')}`}
									className='text-brand hover:underline'
								>
									{SUPPORT_TELEPHONE}
								</a>
							</dd>
						</div>
					</dl>
					<p className='mt-6'>
						Thank you for choosing Enusha Capital. Your privacy matters to us.
					</p>
				</section>
			</div>
		</div>
	)
}
