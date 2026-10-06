import { randomUUID } from 'node:crypto'

import { getSql } from '@/lib/db'
import {
	type OnboardFormValues,
} from '@/lib/onboard/schema'

export interface StoredOnboardingDocument {
	id: string
	name: string
	size: number
	type: string
	storageUrl: string
}

export interface OnboardingRecord {
	reference: string
	submittedAt: string
	payload: OnboardFormValues
	documents: Omit<StoredOnboardingDocument, 'storageUrl'>[]
	malwareScan: string
}

export class DuplicateOnboardingError extends Error {
	reference: string

	constructor (reference: string) {
		super(
			`A submission for this company already exists (${reference}). Your answers have been kept. Contact Enusha if you need to update an existing application.`,
		)
		this.name = 'DuplicateOnboardingError'
		this.reference = reference
	}
}

function emptyToNull (value: string): string | null {
	const trimmed = value.trim()
	return trimmed.length === 0 ? null : trimmed
}

function toInt (value: string): number | null {
	const trimmed = value.trim()
	if (trimmed === '') {
		return null
	}

	return Number(trimmed)
}

function toDate (value: string): string | null {
	return emptyToNull(value)
}

function toRequiredYesNo (value: 'yes' | 'no'): boolean {
	return value === 'yes'
}

function toOptionalYesNo (value: 'yes' | 'no' | ''): boolean | null {
	if (value === '') {
		return null
	}

	return value === 'yes'
}

function isFilledContact (
	contact: OnboardFormValues['contacts']['hr'][number],
): boolean {
	return [
		contact.fullName,
		contact.jobTitle,
		contact.email,
		contact.mobile,
		contact.officeTelephone,
	].some((value) => value.trim().length > 0)
}

function isUniqueViolation (error: unknown): boolean {
	return (
		typeof error === 'object' &&
		error !== null &&
		'code' in error &&
		(error as { code?: string }).code === '23505'
	)
}

export async function findExistingOnboardingReference (
	registrationNumber: string,
	kraPin: string,
): Promise<string | null> {
	const sql = getSql()
	const rows = await sql`
		SELECT reference
		FROM onboarding_submissions
		WHERE lower(registration_number) = lower(${registrationNumber})
			AND lower(kra_pin) = lower(${kraPin})
		LIMIT 1
	`

	const existing = rows[0] as { reference?: string } | undefined
	return existing?.reference ?? null
}

export async function persistOnboardingSubmission (input: {
	record: OnboardingRecord
	documents: StoredOnboardingDocument[]
	payloadUrl: string
}): Promise<void> {
	const sql = getSql()
	const { record, documents, payloadUrl } = input
	const { payload } = record
	const submissionId = randomUUID()

	const existing = await findExistingOnboardingReference(
		payload.company.registrationNumber,
		payload.company.kraPin,
	)
	if (existing) {
		throw new DuplicateOnboardingError(existing)
	}

	const contactRows = [
		...payload.contacts.hr
			.filter(isFilledContact)
			.map((contact, index) => ({
				role: 'hr' as const,
				sortOrder: index,
				contact,
			})),
		...payload.contacts.finance
			.filter(isFilledContact)
			.map((contact, index) => ({
				role: 'finance' as const,
				sortOrder: index,
				contact,
			})),
		...payload.contacts.other
			.filter(isFilledContact)
			.map((contact, index) => ({
				role: 'other' as const,
				sortOrder: index,
				contact,
			})),
		...payload.contacts.additional
			.filter(isFilledContact)
			.map((contact, index) => ({
				role: 'additional' as const,
				sortOrder: index,
				contact,
			})),
	]

	try {
		await sql.transaction((txn) => [
			txn`
				INSERT INTO onboarding_submissions (
					id,
					reference,
					status,
					registered_name,
					trading_name,
					registration_number,
					kra_pin,
					date_incorporated,
					years_in_operation,
					industry,
					nature_of_business,
					legal_structure,
					legal_structure_other,
					physical_address,
					building_road,
					city_town,
					county,
					postal_address,
					postal_code,
					main_telephone,
					general_email,
					website,
					escalation_name,
					escalation_email,
					escalation_telephone,
					managers_count,
					managers_pct,
					non_managers_count,
					non_managers_pct,
					subordinate_count,
					subordinate_pct,
					total_staff,
					permanent_count,
					fixed_term_count,
					consultants_count,
					eligible_count,
					min_service_period,
					payment_frequency,
					payment_frequency_other,
					salary_payment_date,
					compensation_types,
					compensation_other,
					average_monthly_payroll,
					has_payroll_system,
					payroll_provider,
					can_generate_schedules,
					deduction_cutoff_date,
					remittance_date,
					turnover_rate,
					exits_last_12,
					redundancies_last_24,
					planned_restructuring,
					restructuring_explanation,
					delayed_salaries,
					delayed_explanation,
					requested_products,
					initial_applicants,
					estimated_monthly_value,
					existing_lenders,
					consent_process,
					exit_notification_timeline,
					mou_legal_name,
					mou_notices_address,
					mou_notices_email,
					mou_commencement_date,
					mou_term,
					mou_special_clauses,
					declarant_name,
					declarant_job_title,
					declarant_email,
					declaration_date,
					declared_accurate,
					declared_authority,
					declared_privacy,
					payload,
					payload_url,
					submitted_at
				) VALUES (
					${submissionId},
					${record.reference},
					'received',
					${payload.company.registeredName},
					${emptyToNull(payload.company.tradingName)},
					${payload.company.registrationNumber},
					${payload.company.kraPin},
					${toDate(payload.company.dateIncorporated)},
					${Number(payload.company.yearsInOperation)},
					${payload.company.industry},
					${payload.company.natureOfBusiness},
					${payload.company.legalStructure},
					${emptyToNull(payload.company.legalStructureOther)},
					${payload.address.physicalAddress},
					${emptyToNull(payload.address.buildingRoad)},
					${payload.address.cityTown},
					${payload.address.county},
					${emptyToNull(payload.address.postalAddress)},
					${emptyToNull(payload.address.postalCode)},
					${payload.address.mainTelephone},
					${payload.address.generalEmail},
					${emptyToNull(payload.address.website)},
					${emptyToNull(payload.contacts.escalationName)},
					${emptyToNull(payload.contacts.escalationEmail)},
					${emptyToNull(payload.contacts.escalationTelephone)},
					${toInt(payload.workforce.managersCount)},
					${toInt(payload.workforce.managersPct)},
					${toInt(payload.workforce.nonManagersCount)},
					${toInt(payload.workforce.nonManagersPct)},
					${toInt(payload.workforce.subordinateCount)},
					${toInt(payload.workforce.subordinatePct)},
					${Number(payload.workforce.totalStaff)},
					${toInt(payload.workforce.permanent)},
					${toInt(payload.workforce.fixedTerm)},
					${toInt(payload.workforce.consultants)},
					${toInt(payload.workforce.eligible)},
					${emptyToNull(payload.workforce.minServicePeriod)},
					${payload.payroll.paymentFrequency},
					${emptyToNull(payload.payroll.paymentFrequencyOther)},
					${emptyToNull(payload.payroll.salaryPaymentDate)},
					${payload.payroll.compensationTypes},
					${emptyToNull(payload.payroll.compensationOther)},
					${emptyToNull(payload.payroll.averageMonthlyPayroll)},
					${toRequiredYesNo(payload.payroll.hasPayrollSystem as 'yes' | 'no')},
					${emptyToNull(payload.payroll.payrollProvider)},
					${toOptionalYesNo(payload.payroll.canGenerateSchedules)},
					${emptyToNull(payload.payroll.deductionCutoffDate)},
					${emptyToNull(payload.payroll.remittanceDate)},
					${payload.stability.turnoverRate},
					${toInt(payload.stability.exitsLast12)},
					${toInt(payload.stability.redundanciesLast24)},
					${toRequiredYesNo(payload.stability.plannedRestructuring as 'yes' | 'no')},
					${emptyToNull(payload.stability.restructuringExplanation)},
					${toRequiredYesNo(payload.stability.delayedSalaries as 'yes' | 'no')},
					${emptyToNull(payload.stability.delayedExplanation)},
					${payload.stability.requestedProducts},
					${toInt(payload.stability.initialApplicants)},
					${emptyToNull(payload.stability.estimatedMonthlyValue)},
					${emptyToNull(payload.stability.existingLenders)},
					${payload.stability.consentProcess},
					${payload.stability.exitNotificationTimeline},
					${payload.mou.legalName},
					${payload.mou.noticesAddress},
					${payload.mou.noticesEmail},
					${toDate(payload.mou.commencementDate)},
					${emptyToNull(payload.mou.term)},
					${emptyToNull(payload.mou.specialClauses)},
					${payload.declaration.fullName},
					${payload.declaration.jobTitle},
					${payload.declaration.email},
					${payload.declaration.date},
					${payload.declaration.accurate},
					${payload.declaration.authority},
					${payload.declaration.privacy},
					${record},
					${payloadUrl},
					${record.submittedAt}
				)
			`,
			...contactRows.map(({ role, sortOrder, contact }) => txn`
				INSERT INTO onboarding_contacts (
					submission_id,
					role,
					sort_order,
					full_name,
					job_title,
					email,
					mobile,
					office_telephone
				) VALUES (
					${submissionId},
					${role},
					${sortOrder},
					${contact.fullName},
					${contact.jobTitle},
					${contact.email},
					${contact.mobile},
					${emptyToNull(contact.officeTelephone)}
				)
			`),
			...payload.payroll.bands.map((band, index) => txn`
				INSERT INTO onboarding_salary_bands (
					submission_id,
					sort_order,
					salary_range,
					employee_count,
					notes
				) VALUES (
					${submissionId},
					${index},
					${emptyToNull(band.range)},
					${toInt(band.employees)},
					${emptyToNull(band.notes)}
				)
			`),
			...payload.mou.signatories.map((signatory, index) => txn`
				INSERT INTO onboarding_signatories (
					submission_id,
					sort_order,
					full_name,
					job_title,
					email,
					telephone,
					signing_authority
				) VALUES (
					${submissionId},
					${index},
					${signatory.fullName},
					${signatory.jobTitle},
					${signatory.email},
					${signatory.telephone},
					${signatory.signingAuthority}
				)
			`),
			...documents.map((document) => txn`
				INSERT INTO onboarding_documents (
					submission_id,
					document_type,
					file_name,
					mime_type,
					size_bytes,
					storage_url
				) VALUES (
					${submissionId},
					${document.id},
					${document.name},
					${document.type || 'application/octet-stream'},
					${document.size},
					${document.storageUrl}
				)
			`),
		])
	} catch (error) {
		if (isUniqueViolation(error)) {
			const duplicate = await findExistingOnboardingReference(
				payload.company.registrationNumber,
				payload.company.kraPin,
			)
			throw new DuplicateOnboardingError(
				duplicate ?? record.reference,
			)
		}

		throw error
	}
}
