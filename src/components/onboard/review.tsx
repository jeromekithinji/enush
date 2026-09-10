import { Button } from '@/components/ui/button'
import { ONBOARD_STEPS, DOCUMENT_TYPES } from '@/lib/onboard/constants'
import type { OnboardFormValues } from '@/lib/onboard/schema'
import { getWorkforceMismatch } from '@/lib/onboard/schema'

interface ReviewSectionProps {
	title: string
	stepIndex: number
	onEdit?: (step: number) => void
	children: React.ReactNode
}

function ReviewSection ({ title, stepIndex, onEdit, children }: ReviewSectionProps) {
	return (
		<section className='rounded-xl border border-zinc-200 p-5'>
			<div className='mb-4 flex items-start justify-between gap-3'>
				<h3 className='font-heading text-xl font-semibold text-charcoal'>{title}</h3>
				{onEdit ? (
					<Button type='button' variant='outline' className='h-9 print:hidden' onClick={() => onEdit(stepIndex)}>
						Edit
					</Button>
				) : null}
			</div>
			{children}
		</section>
	)
}

function Row ({ label, value }: { label: string, value?: string | number | boolean | string[] | null }) {
	let display = '—'
	if (Array.isArray(value)) {
		display = value.length > 0 ? value.join(', ') : '—'
	} else if (typeof value === 'boolean') {
		display = value ? 'Yes' : 'No'
	} else if (value !== undefined && value !== null && String(value).trim() !== '') {
		display = String(value)
	}

	return (
		<div className='grid grid-cols-1 gap-1 border-b border-zinc-100 py-2 last:border-b-0 sm:grid-cols-3'>
			<dt className='text-sm text-muted-foreground'>{label}</dt>
			<dd className='text-sm text-charcoal sm:col-span-2'>{display}</dd>
		</div>
	)
}

function ContactBlock ({
	title,
	contacts,
}: {
	title: string
	contacts: OnboardFormValues['contacts']['hr']
}) {
	if (contacts.length === 0) {
		return <p className='text-sm text-muted-foreground'>{title}: none provided</p>
	}

	return (
		<div className='space-y-3'>
			{contacts.map((contact, index) => (
				<div key={`${title}-${index}`}>
					<p className='mb-1 text-sm font-medium text-charcoal'>
						{title} {index + 1}
					</p>
					<dl>
						<Row label='Full name' value={contact.fullName} />
						<Row label='Job title' value={contact.jobTitle} />
						<Row label='Email' value={contact.email} />
						<Row label='Mobile' value={contact.mobile} />
						<Row label='Office telephone' value={contact.officeTelephone} />
					</dl>
				</div>
			))}
		</div>
	)
}

interface ReviewProps {
	values: OnboardFormValues
	documentNames: Record<string, string>
	onEdit?: (step: number) => void
}

export function OnboardReview ({ values, documentNames, onEdit }: ReviewProps) {
	const mismatch = getWorkforceMismatch(values.workforce)

	return (
		<div className='space-y-5'>
			<p className='text-sm text-muted-foreground'>
				Review all information before submitting. You can return to any
				section to make corrections without losing your entries.
			</p>
			<ReviewSection title='Company Details' stepIndex={0} onEdit={onEdit}>
				<dl>
					<Row label='Registered company name' value={values.company.registeredName} />
					<Row label='Trading name' value={values.company.tradingName} />
					<Row label='Registration/incorporation number' value={values.company.registrationNumber} />
					<Row label='KRA PIN' value={values.company.kraPin} />
					<Row label='Date incorporated' value={values.company.dateIncorporated} />
					<Row label='Years in operation' value={values.company.yearsInOperation} />
					<Row label='Industry/sector' value={values.company.industry} />
					<Row label='Nature of business' value={values.company.natureOfBusiness} />
					<Row
						label='Legal structure'
						value={
							values.company.legalStructure === 'Other'
								? values.company.legalStructureOther
								: values.company.legalStructure
						}
					/>
				</dl>
			</ReviewSection>
			<ReviewSection title='Address & Contact' stepIndex={1} onEdit={onEdit}>
				<dl>
					<Row label='Physical address' value={values.address.physicalAddress} />
					<Row label='Building/road' value={values.address.buildingRoad} />
					<Row label='City/town' value={values.address.cityTown} />
					<Row label='County' value={values.address.county} />
					<Row label='Postal address' value={values.address.postalAddress} />
					<Row label='Postal code' value={values.address.postalCode} />
					<Row label='Main telephone' value={values.address.mainTelephone} />
					<Row label='General company email' value={values.address.generalEmail} />
					<Row label='Website' value={values.address.website} />
				</dl>
			</ReviewSection>
			<ReviewSection title='Authorised Contacts' stepIndex={2} onEdit={onEdit}>
				<div className='space-y-5'>
					<ContactBlock title='HR' contacts={values.contacts.hr} />
					<ContactBlock title='Finance/Payroll' contacts={values.contacts.finance} />
					<ContactBlock title='Other' contacts={values.contacts.other} />
					<ContactBlock title='Additional' contacts={values.contacts.additional} />
					<dl>
						<Row label='Senior escalation contact' value={values.contacts.escalationName} />
						<Row label='Escalation email' value={values.contacts.escalationEmail} />
						<Row label='Escalation telephone' value={values.contacts.escalationTelephone} />
					</dl>
				</div>
			</ReviewSection>
			<ReviewSection title='Workforce Profile' stepIndex={3} onEdit={onEdit}>
				<dl>
					<Row label='Managers/senior management' value={`${values.workforce.managersCount || '—'} (${values.workforce.managersPct || '—'}%)`} />
					<Row label='Non-managers/professional staff' value={`${values.workforce.nonManagersCount || '—'} (${values.workforce.nonManagersPct || '—'}%)`} />
					<Row label='Subordinate/support staff' value={`${values.workforce.subordinateCount || '—'} (${values.workforce.subordinatePct || '—'}%)`} />
					<Row label='Total staff complement' value={values.workforce.totalStaff} />
					<Row label='Permanent employees' value={values.workforce.permanent} />
					<Row label='Fixed-term contract employees' value={values.workforce.fixedTerm} />
					<Row label='Consultants/casuals' value={values.workforce.consultants} />
					<Row label='Employees eligible for check-off' value={values.workforce.eligible} />
					<Row label='Minimum service period' value={values.workforce.minServicePeriod} />
				</dl>
				{mismatch ? (
					<p className='mt-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-950'>
						{mismatch}
					</p>
				) : null}
			</ReviewSection>
			<ReviewSection title='Salary & Payroll' stepIndex={4} onEdit={onEdit}>
				<div className='space-y-3'>
					{values.payroll.bands.map((band, index) => (
						<dl key={`band-${index}`}>
							<p className='text-sm font-medium text-charcoal'>Salary band {index + 1}</p>
							<Row label='Gross monthly salary range (KES)' value={band.range} />
							<Row label='Number of employees' value={band.employees} />
							<Row label='Notes' value={band.notes} />
						</dl>
					))}
					<dl>
						<Row
							label='Payment frequency'
							value={
								values.payroll.paymentFrequency === 'Other'
									? values.payroll.paymentFrequencyOther
									: values.payroll.paymentFrequency
							}
						/>
						<Row label='Normal salary payment date' value={values.payroll.salaryPaymentDate} />
						<Row label='Compensation types' value={values.payroll.compensationTypes} />
						<Row label='Other compensation' value={values.payroll.compensationOther} />
						<Row label='Average monthly gross payroll (KES)' value={values.payroll.averageMonthlyPayroll} />
						<Row label='Has payroll system' value={values.payroll.hasPayrollSystem} />
						<Row label='Payroll system/provider' value={values.payroll.payrollProvider} />
						<Row label='Can generate deduction schedules' value={values.payroll.canGenerateSchedules} />
						<Row label='Proposed monthly deduction cut-off date' value={values.payroll.deductionCutoffDate} />
						<Row label='Proposed remittance date to Enusha' value={values.payroll.remittanceDate} />
					</dl>
				</div>
			</ReviewSection>
			<ReviewSection title='Staff Stability' stepIndex={5} onEdit={onEdit}>
				<dl>
					<Row label='Annual staff exit/turnover rate' value={values.stability.turnoverRate} />
					<Row label='Exits in the last 12 months' value={values.stability.exitsLast12} />
					<Row label='Redundancies in the last 24 months' value={values.stability.redundanciesLast24} />
					<Row label='Planned restructuring or redundancy' value={values.stability.plannedRestructuring} />
					<Row label='Restructuring explanation' value={values.stability.restructuringExplanation} />
					<Row label='Delayed salary payments in the last 12 months' value={values.stability.delayedSalaries} />
					<Row label='Delayed salary explanation' value={values.stability.delayedExplanation} />
					<Row label='Requested products' value={values.stability.requestedProducts} />
					<Row label='Expected number of initial applicants' value={values.stability.initialApplicants} />
					<Row label='Estimated monthly check-off value (KES)' value={values.stability.estimatedMonthlyValue} />
					<Row label='Existing staff lenders or check-off providers' value={values.stability.existingLenders} />
					<Row label='Employee consent process' value={values.stability.consentProcess} />
					<Row label='Exit notification timeline to Enusha' value={values.stability.exitNotificationTimeline} />
				</dl>
			</ReviewSection>
			<ReviewSection title='MOU Information' stepIndex={6} onEdit={onEdit}>
				<dl>
					<Row label='Full legal name for the MOU' value={values.mou.legalName} />
					<Row label='Registered office/address for notices' value={values.mou.noticesAddress} />
					<Row label='Official email for MOU notices' value={values.mou.noticesEmail} />
					<Row label='Proposed commencement date' value={values.mou.commencementDate} />
					<Row label='Proposed MOU term' value={values.mou.term} />
					<Row label='Special requirements or clauses' value={values.mou.specialClauses} />
				</dl>
				<div className='mt-4 space-y-3'>
					{values.mou.signatories.map((signatory, index) => (
						<dl key={`signatory-${index}`}>
							<p className='text-sm font-medium text-charcoal'>Signatory {index + 1}</p>
							<Row label='Full name' value={signatory.fullName} />
							<Row label='Job title' value={signatory.jobTitle} />
							<Row label='Email' value={signatory.email} />
							<Row label='Telephone' value={signatory.telephone} />
							<Row label='Signing authority' value={signatory.signingAuthority} />
						</dl>
					))}
				</div>
			</ReviewSection>
			<ReviewSection title='Documents' stepIndex={7} onEdit={onEdit}>
				<dl>
					{DOCUMENT_TYPES.map((documentType) => (
						<Row
							key={documentType.id}
							label={documentType.label}
							value={documentNames[documentType.id] ?? 'Not attached'}
						/>
					))}
				</dl>
			</ReviewSection>
			<ReviewSection title='Declaration' stepIndex={8} onEdit={onEdit}>
				<dl>
					<Row label='Declarant’s full name' value={values.declaration.fullName} />
					<Row label='Job title' value={values.declaration.jobTitle} />
					<Row label='Official company email' value={values.declaration.email} />
					<Row label='Date' value={values.declaration.date} />
					<Row label='Declaration accepted' value={values.declaration.accurate} />
					<Row label='Authority to submit confirmed' value={values.declaration.authority} />
					<Row label='Privacy Notice consent' value={values.declaration.privacy} />
				</dl>
			</ReviewSection>
			<p className='text-xs text-muted-foreground'>
				{ONBOARD_STEPS.length} sections collected. Documents listed by filename
				only; files are not stored in this browser draft.
			</p>
		</div>
	)
}
