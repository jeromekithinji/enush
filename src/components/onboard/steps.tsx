'use client'

import { type UseFormReturn, useFieldArray } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, inputClassName } from '@/components/onboard/field'
import {
	COMPENSATION_TYPES,
	LEGAL_STRUCTURES,
	PAYMENT_FREQUENCIES,
	REQUESTED_PRODUCTS,
	TURNOVER_RATES,
} from '@/lib/onboard/constants'
import {
	getWorkforceMismatch,
	type OnboardFormValues,
} from '@/lib/onboard/schema'

interface StepProps {
	form: UseFormReturn<OnboardFormValues>
}

function errorMessage (
	form: UseFormReturn<OnboardFormValues>,
	path: string,
): string | undefined {
	const parts = path.split('.')
	let current: unknown = form.formState.errors
	for (const part of parts) {
		if (!current || typeof current !== 'object') {
			return undefined
		}
		current = (current as Record<string, unknown>)[part]
	}
	if (current && typeof current === 'object' && 'message' in current) {
		return String((current as { message?: string }).message ?? '')
	}
	return undefined
}

export function CompanyDetailsStep ({ form }: StepProps) {
	const { register } = form

	return (
		<div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
			<Field
				id='company.registeredName'
				label='Registered Company Name'
				required
				error={errorMessage(form, 'company.registeredName')}
			>
				<Input
					id='company.registeredName'
					placeholder='e.g. Acme Ltd'
					className={inputClassName(Boolean(errorMessage(form, 'company.registeredName')))}
					aria-invalid={Boolean(errorMessage(form, 'company.registeredName'))}
					{...register('company.registeredName')}
				/>
			</Field>
			<Field id='company.tradingName' label='Trading Name'>
				<Input
					id='company.tradingName'
					placeholder='If different from registered name'
					className={inputClassName()}
					{...register('company.tradingName')}
				/>
			</Field>
			<Field
				id='company.registrationNumber'
				label='Registration/Incorporation Number'
				required
				error={errorMessage(form, 'company.registrationNumber')}
			>
				<Input
					id='company.registrationNumber'
					className={inputClassName(Boolean(errorMessage(form, 'company.registrationNumber')))}
					aria-invalid={Boolean(errorMessage(form, 'company.registrationNumber'))}
					{...register('company.registrationNumber')}
				/>
			</Field>
			<Field
				id='company.kraPin'
				label='KRA PIN'
				required
				error={errorMessage(form, 'company.kraPin')}
			>
				<Input
					id='company.kraPin'
					className={inputClassName(Boolean(errorMessage(form, 'company.kraPin')))}
					aria-invalid={Boolean(errorMessage(form, 'company.kraPin'))}
					{...register('company.kraPin')}
				/>
			</Field>
			<Field id='company.dateIncorporated' label='Date Incorporated'>
				<Input
					id='company.dateIncorporated'
					type='date'
					className={inputClassName()}
					{...register('company.dateIncorporated')}
				/>
			</Field>
			<Field
				id='company.yearsInOperation'
				label='Years in Operation'
				error={errorMessage(form, 'company.yearsInOperation')}
			>
				<Input
					id='company.yearsInOperation'
					placeholder='e.g. 5'
					inputMode='numeric'
					className={inputClassName(Boolean(errorMessage(form, 'company.yearsInOperation')))}
					{...register('company.yearsInOperation')}
				/>
			</Field>
			<Field
				id='company.industry'
				label='Industry/Sector'
				required
				error={errorMessage(form, 'company.industry')}
			>
				<Input
					id='company.industry'
					placeholder='e.g. Manufacturing'
					className={inputClassName(Boolean(errorMessage(form, 'company.industry')))}
					aria-invalid={Boolean(errorMessage(form, 'company.industry'))}
					{...register('company.industry')}
				/>
			</Field>
			<Field id='company.natureOfBusiness' label='Nature of Business'>
				<Input
					id='company.natureOfBusiness'
					placeholder='Brief description'
					className={inputClassName()}
					{...register('company.natureOfBusiness')}
				/>
			</Field>
			<Field
				id='company.legalStructure'
				label='Legal Structure'
				required
				error={errorMessage(form, 'company.legalStructure')}
			>
				<select
					id='company.legalStructure'
					className={inputClassName(Boolean(errorMessage(form, 'company.legalStructure')))}
					aria-invalid={Boolean(errorMessage(form, 'company.legalStructure'))}
					{...register('company.legalStructure')}
				>
					<option value=''>Select legal structure</option>
					{LEGAL_STRUCTURES.map((structure) => (
						<option key={structure} value={structure}>
							{structure}
						</option>
					))}
				</select>
			</Field>
			{form.watch('company.legalStructure') === 'Other' ? (
				<Field
					id='company.legalStructureOther'
					label='Describe legal structure'
					required
					error={errorMessage(form, 'company.legalStructureOther')}
				>
					<Input
						id='company.legalStructureOther'
						className={inputClassName(Boolean(errorMessage(form, 'company.legalStructureOther')))}
						{...register('company.legalStructureOther')}
					/>
				</Field>
			) : null}
		</div>
	)
}

export function AddressStep ({ form }: StepProps) {
	const { register } = form
	return (
		<div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
			<Field id='address.physicalAddress' label='Physical address' required error={errorMessage(form, 'address.physicalAddress')}>
				<Input id='address.physicalAddress' className={inputClassName(Boolean(errorMessage(form, 'address.physicalAddress')))} {...register('address.physicalAddress')} />
			</Field>
			<Field id='address.buildingRoad' label='Building/road'>
				<Input id='address.buildingRoad' className={inputClassName()} {...register('address.buildingRoad')} />
			</Field>
			<Field id='address.cityTown' label='City/town' required error={errorMessage(form, 'address.cityTown')}>
				<Input id='address.cityTown' className={inputClassName(Boolean(errorMessage(form, 'address.cityTown')))} {...register('address.cityTown')} />
			</Field>
			<Field id='address.county' label='County' required error={errorMessage(form, 'address.county')}>
				<Input id='address.county' className={inputClassName(Boolean(errorMessage(form, 'address.county')))} {...register('address.county')} />
			</Field>
			<Field id='address.postalAddress' label='Postal address'>
				<Input id='address.postalAddress' className={inputClassName()} {...register('address.postalAddress')} />
			</Field>
			<Field id='address.postalCode' label='Postal code'>
				<Input id='address.postalCode' className={inputClassName()} {...register('address.postalCode')} />
			</Field>
			<Field id='address.mainTelephone' label='Main telephone' required error={errorMessage(form, 'address.mainTelephone')}>
				<Input id='address.mainTelephone' type='tel' className={inputClassName(Boolean(errorMessage(form, 'address.mainTelephone')))} {...register('address.mainTelephone')} />
			</Field>
			<Field id='address.generalEmail' label='General company email' required error={errorMessage(form, 'address.generalEmail')}>
				<Input id='address.generalEmail' type='email' className={inputClassName(Boolean(errorMessage(form, 'address.generalEmail')))} {...register('address.generalEmail')} />
			</Field>
			<Field id='address.website' label='Website'>
				<Input id='address.website' type='url' placeholder='https://' className={inputClassName()} {...register('address.website')} />
			</Field>
		</div>
	)
}

function ContactFields ({
	form,
	basePath,
	title,
}: {
	form: UseFormReturn<OnboardFormValues>
	basePath: `contacts.hr` | `contacts.finance` | `contacts.other` | `contacts.additional`
	title: string
}) {
	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: basePath,
	})

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between gap-3'>
				<h3 className='font-heading text-lg font-semibold text-charcoal'>{title}</h3>
				<Button
					type='button'
					variant='outline'
					className='h-9'
					onClick={() => append({
						fullName: '',
						jobTitle: '',
						email: '',
						mobile: '',
						officeTelephone: '',
					})}
				>
					Add contact
				</Button>
			</div>
			{fields.map((field, index) => (
				<div key={field.id} className='rounded-xl border border-zinc-200 p-4'>
					<div className='mb-3 flex items-center justify-between'>
						<p className='text-sm font-medium text-charcoal'>Contact {index + 1}</p>
						{fields.length > 1 || basePath === 'contacts.other' || basePath === 'contacts.additional' ? (
							<Button type='button' variant='ghost' className='h-8 text-destructive' onClick={() => remove(index)}>
								Remove
							</Button>
						) : null}
					</div>
					<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
						<Field id={`${basePath}.${index}.fullName`} label='Full name' required error={errorMessage(form, `${basePath}.${index}.fullName`)}>
							<Input id={`${basePath}.${index}.fullName`} className={inputClassName(Boolean(errorMessage(form, `${basePath}.${index}.fullName`)))} {...form.register(`${basePath}.${index}.fullName`)} />
						</Field>
						<Field id={`${basePath}.${index}.jobTitle`} label='Job title' required error={errorMessage(form, `${basePath}.${index}.jobTitle`)}>
							<Input id={`${basePath}.${index}.jobTitle`} className={inputClassName(Boolean(errorMessage(form, `${basePath}.${index}.jobTitle`)))} {...form.register(`${basePath}.${index}.jobTitle`)} />
						</Field>
						<Field id={`${basePath}.${index}.email`} label='Email address' required error={errorMessage(form, `${basePath}.${index}.email`)}>
							<Input id={`${basePath}.${index}.email`} type='email' className={inputClassName(Boolean(errorMessage(form, `${basePath}.${index}.email`)))} {...form.register(`${basePath}.${index}.email`)} />
						</Field>
						<Field id={`${basePath}.${index}.mobile`} label='Mobile number' required error={errorMessage(form, `${basePath}.${index}.mobile`)}>
							<Input id={`${basePath}.${index}.mobile`} type='tel' className={inputClassName(Boolean(errorMessage(form, `${basePath}.${index}.mobile`)))} {...form.register(`${basePath}.${index}.mobile`)} />
						</Field>
						<Field id={`${basePath}.${index}.officeTelephone`} label='Office telephone'>
							<Input id={`${basePath}.${index}.officeTelephone`} type='tel' className={inputClassName()} {...form.register(`${basePath}.${index}.officeTelephone`)} />
						</Field>
					</div>
				</div>
			))}
		</div>
	)
}

export function ContactsStep ({ form }: StepProps) {
	return (
		<div className='space-y-8'>
			<p className='rounded-lg bg-cream px-4 py-3 text-sm text-charcoal'>
				Please provide at least two contacts, including HR and Finance/Payroll.
			</p>
			<ContactFields form={form} basePath='contacts.hr' title='HR' />
			<ContactFields form={form} basePath='contacts.finance' title='Finance/Payroll' />
			<ContactFields form={form} basePath='contacts.other' title='Other' />
			<ContactFields form={form} basePath='contacts.additional' title='Additional contacts' />
			<div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
				<Field id='contacts.escalationName' label='Senior escalation contact'>
					<Input id='contacts.escalationName' className={inputClassName()} {...form.register('contacts.escalationName')} />
				</Field>
				<Field id='contacts.escalationEmail' label='Escalation email' error={errorMessage(form, 'contacts.escalationEmail')}>
					<Input id='contacts.escalationEmail' type='email' className={inputClassName(Boolean(errorMessage(form, 'contacts.escalationEmail')))} {...form.register('contacts.escalationEmail')} />
				</Field>
				<Field id='contacts.escalationTelephone' label='Escalation telephone'>
					<Input id='contacts.escalationTelephone' type='tel' className={inputClassName()} {...form.register('contacts.escalationTelephone')} />
				</Field>
			</div>
		</div>
	)
}

export function WorkforceStep ({ form }: StepProps) {
	const mismatch = getWorkforceMismatch(form.watch('workforce'))
	return (
		<div className='space-y-5'>
			<div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
				<Field id='workforce.managersCount' label='Managers/senior management (number)' error={errorMessage(form, 'workforce.managersCount')}>
					<Input id='workforce.managersCount' inputMode='numeric' className={inputClassName(Boolean(errorMessage(form, 'workforce.managersCount')))} {...form.register('workforce.managersCount')} />
				</Field>
				<Field id='workforce.managersPct' label='Managers/senior management (%)' error={errorMessage(form, 'workforce.managersPct')}>
					<Input id='workforce.managersPct' inputMode='decimal' className={inputClassName(Boolean(errorMessage(form, 'workforce.managersPct')))} {...form.register('workforce.managersPct')} />
				</Field>
				<Field id='workforce.nonManagersCount' label='Non-managers/professional staff (number)' error={errorMessage(form, 'workforce.nonManagersCount')}>
					<Input id='workforce.nonManagersCount' inputMode='numeric' className={inputClassName(Boolean(errorMessage(form, 'workforce.nonManagersCount')))} {...form.register('workforce.nonManagersCount')} />
				</Field>
				<Field id='workforce.nonManagersPct' label='Non-managers/professional staff (%)' error={errorMessage(form, 'workforce.nonManagersPct')}>
					<Input id='workforce.nonManagersPct' inputMode='decimal' className={inputClassName(Boolean(errorMessage(form, 'workforce.nonManagersPct')))} {...form.register('workforce.nonManagersPct')} />
				</Field>
				<Field id='workforce.subordinateCount' label='Subordinate/support staff (number)' error={errorMessage(form, 'workforce.subordinateCount')}>
					<Input id='workforce.subordinateCount' inputMode='numeric' className={inputClassName(Boolean(errorMessage(form, 'workforce.subordinateCount')))} {...form.register('workforce.subordinateCount')} />
				</Field>
				<Field id='workforce.subordinatePct' label='Subordinate/support staff (%)' error={errorMessage(form, 'workforce.subordinatePct')}>
					<Input id='workforce.subordinatePct' inputMode='decimal' className={inputClassName(Boolean(errorMessage(form, 'workforce.subordinatePct')))} {...form.register('workforce.subordinatePct')} />
				</Field>
				<Field id='workforce.totalStaff' label='Total staff complement' required error={errorMessage(form, 'workforce.totalStaff')}>
					<Input id='workforce.totalStaff' inputMode='numeric' className={inputClassName(Boolean(errorMessage(form, 'workforce.totalStaff')))} {...form.register('workforce.totalStaff')} />
				</Field>
				<Field id='workforce.permanent' label='Permanent employees' error={errorMessage(form, 'workforce.permanent')}>
					<Input id='workforce.permanent' inputMode='numeric' className={inputClassName(Boolean(errorMessage(form, 'workforce.permanent')))} {...form.register('workforce.permanent')} />
				</Field>
				<Field id='workforce.fixedTerm' label='Fixed-term contract employees' error={errorMessage(form, 'workforce.fixedTerm')}>
					<Input id='workforce.fixedTerm' inputMode='numeric' className={inputClassName(Boolean(errorMessage(form, 'workforce.fixedTerm')))} {...form.register('workforce.fixedTerm')} />
				</Field>
				<Field id='workforce.consultants' label='Consultants/casuals' error={errorMessage(form, 'workforce.consultants')}>
					<Input id='workforce.consultants' inputMode='numeric' className={inputClassName(Boolean(errorMessage(form, 'workforce.consultants')))} {...form.register('workforce.consultants')} />
				</Field>
				<Field id='workforce.eligible' label='Employees eligible for check-off' error={errorMessage(form, 'workforce.eligible')}>
					<Input id='workforce.eligible' inputMode='numeric' className={inputClassName(Boolean(errorMessage(form, 'workforce.eligible')))} {...form.register('workforce.eligible')} />
				</Field>
				<Field id='workforce.minServicePeriod' label='Minimum service period for eligibility'>
					<Input id='workforce.minServicePeriod' placeholder='e.g. 6 months' className={inputClassName()} {...form.register('workforce.minServicePeriod')} />
				</Field>
			</div>
			{mismatch ? (
				<p role='status' className='rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950'>
					{mismatch}
				</p>
			) : null}
		</div>
	)
}

export function PayrollStep ({ form }: StepProps) {
	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'payroll.bands',
	})
	const compensationTypes = form.watch('payroll.compensationTypes')
	const hasPayrollSystem = form.watch('payroll.hasPayrollSystem')
	const paymentFrequency = form.watch('payroll.paymentFrequency')

	function toggleCompensation (value: string) {
		const next = compensationTypes.includes(value)
			? compensationTypes.filter((item) => item !== value)
			: [...compensationTypes, value]
		form.setValue('payroll.compensationTypes', next, { shouldDirty: true })
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h3 className='font-heading text-lg font-semibold text-charcoal'>Salary bands</h3>
				<Button type='button' variant='outline' className='h-9' onClick={() => append({ range: '', employees: '', notes: '' })}>
					Add salary band
				</Button>
			</div>
			{fields.map((field, index) => (
				<div key={field.id} className='grid grid-cols-1 gap-4 rounded-xl border border-zinc-200 p-4 md:grid-cols-3'>
					<Field id={`payroll.bands.${index}.range`} label='Gross monthly salary range in KES'>
						<Input id={`payroll.bands.${index}.range`} placeholder='e.g. 50,000–80,000' className={inputClassName()} {...form.register(`payroll.bands.${index}.range`)} />
					</Field>
					<Field id={`payroll.bands.${index}.employees`} label='Number of employees' error={errorMessage(form, `payroll.bands.${index}.employees`)}>
						<Input id={`payroll.bands.${index}.employees`} inputMode='numeric' className={inputClassName(Boolean(errorMessage(form, `payroll.bands.${index}.employees`)))} {...form.register(`payroll.bands.${index}.employees`)} />
					</Field>
					<Field id={`payroll.bands.${index}.notes`} label='Notes'>
						<div className='flex gap-2'>
							<Input id={`payroll.bands.${index}.notes`} className={inputClassName()} {...form.register(`payroll.bands.${index}.notes`)} />
							{fields.length > 1 ? (
								<Button type='button' variant='ghost' className='h-11 text-destructive' onClick={() => remove(index)}>
									Remove
								</Button>
							) : null}
						</div>
					</Field>
				</div>
			))}
			<Field id='payroll.paymentFrequency' label='Payment frequency' required error={errorMessage(form, 'payroll.paymentFrequency')}>
				<div id='payroll.paymentFrequency' tabIndex={-1} className='flex flex-col gap-2'>
					{PAYMENT_FREQUENCIES.map((frequency) => (
						<label key={frequency} className='flex items-center gap-2 text-sm text-charcoal'>
							<input type='radio' value={frequency} {...form.register('payroll.paymentFrequency')} />
							{frequency}
						</label>
					))}
				</div>
			</Field>
			{paymentFrequency === 'Other' ? (
				<Field id='payroll.paymentFrequencyOther' label='Describe payment frequency' required error={errorMessage(form, 'payroll.paymentFrequencyOther')}>
					<Input id='payroll.paymentFrequencyOther' className={inputClassName(Boolean(errorMessage(form, 'payroll.paymentFrequencyOther')))} {...form.register('payroll.paymentFrequencyOther')} />
				</Field>
			) : null}
			<Field id='payroll.salaryPaymentDate' label='Normal salary payment date'>
				<Input id='payroll.salaryPaymentDate' placeholder='e.g. last Friday of the month' className={inputClassName()} {...form.register('payroll.salaryPaymentDate')} />
			</Field>
			<fieldset>
				<legend className='mb-2 text-sm font-medium text-charcoal'>Compensation types</legend>
				<div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
					{COMPENSATION_TYPES.map((type) => (
						<label key={type} className='flex items-center gap-2 text-sm text-charcoal'>
							<input
								type='checkbox'
								checked={compensationTypes.includes(type)}
								onChange={() => toggleCompensation(type)}
							/>
							{type}
						</label>
					))}
				</div>
			</fieldset>
			{compensationTypes.includes('Other') ? (
				<Field id='payroll.compensationOther' label='Describe other compensation' required error={errorMessage(form, 'payroll.compensationOther')}>
					<Input id='payroll.compensationOther' className={inputClassName(Boolean(errorMessage(form, 'payroll.compensationOther')))} {...form.register('payroll.compensationOther')} />
				</Field>
			) : null}
			<Field id='payroll.averageMonthlyPayroll' label='Average monthly gross payroll in KES'>
				<Input id='payroll.averageMonthlyPayroll' inputMode='numeric' className={inputClassName()} {...form.register('payroll.averageMonthlyPayroll')} />
			</Field>
			<Field id='payroll.hasPayrollSystem' label='Does the company have a payroll system?' required error={errorMessage(form, 'payroll.hasPayrollSystem')}>
				<div id='payroll.hasPayrollSystem' tabIndex={-1} className='flex gap-4'>
					<label className='flex items-center gap-2 text-sm'><input type='radio' value='yes' {...form.register('payroll.hasPayrollSystem')} /> Yes</label>
					<label className='flex items-center gap-2 text-sm'><input type='radio' value='no' {...form.register('payroll.hasPayrollSystem')} /> No</label>
				</div>
			</Field>
			{hasPayrollSystem === 'yes' ? (
				<Field id='payroll.payrollProvider' label='Payroll system/provider' required error={errorMessage(form, 'payroll.payrollProvider')}>
					<Input id='payroll.payrollProvider' className={inputClassName(Boolean(errorMessage(form, 'payroll.payrollProvider')))} {...form.register('payroll.payrollProvider')} />
				</Field>
			) : null}
			<Field id='payroll.canGenerateSchedules' label='Can the payroll system generate deduction schedules?'>
				<div className='flex gap-4'>
					<label className='flex items-center gap-2 text-sm'><input type='radio' value='yes' {...form.register('payroll.canGenerateSchedules')} /> Yes</label>
					<label className='flex items-center gap-2 text-sm'><input type='radio' value='no' {...form.register('payroll.canGenerateSchedules')} /> No</label>
				</div>
			</Field>
			<Field id='payroll.deductionCutoffDate' label='Proposed monthly deduction cut-off date'>
				<Input id='payroll.deductionCutoffDate' type='date' className={inputClassName()} {...form.register('payroll.deductionCutoffDate')} />
			</Field>
			<Field id='payroll.remittanceDate' label='Proposed remittance date to Enusha'>
				<Input id='payroll.remittanceDate' type='date' className={inputClassName()} {...form.register('payroll.remittanceDate')} />
			</Field>
		</div>
	)
}

export function StabilityStep ({ form }: StepProps) {
	const requested = form.watch('stability.requestedProducts')
	const planned = form.watch('stability.plannedRestructuring')
	const delayed = form.watch('stability.delayedSalaries')

	function toggleProduct (value: string) {
		const next = requested.includes(value)
			? requested.filter((item) => item !== value)
			: [...requested, value]
		form.setValue('stability.requestedProducts', next, { shouldDirty: true })
	}

	return (
		<div className='space-y-5'>
			<Field id='stability.turnoverRate' label='Annual staff exit/turnover rate' required error={errorMessage(form, 'stability.turnoverRate')}>
				<div id='stability.turnoverRate' tabIndex={-1} className='flex flex-col gap-2'>
					{TURNOVER_RATES.map((rate) => (
						<label key={rate} className='flex items-center gap-2 text-sm'>
							<input type='radio' value={rate} {...form.register('stability.turnoverRate')} />
							{rate}
						</label>
					))}
				</div>
			</Field>
			<div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
				<Field id='stability.exitsLast12' label='Number of exits in the last 12 months' error={errorMessage(form, 'stability.exitsLast12')}>
					<Input id='stability.exitsLast12' inputMode='numeric' className={inputClassName(Boolean(errorMessage(form, 'stability.exitsLast12')))} {...form.register('stability.exitsLast12')} />
				</Field>
				<Field id='stability.redundanciesLast24' label='Number of redundancies in the last 24 months' error={errorMessage(form, 'stability.redundanciesLast24')}>
					<Input id='stability.redundanciesLast24' inputMode='numeric' className={inputClassName(Boolean(errorMessage(form, 'stability.redundanciesLast24')))} {...form.register('stability.redundanciesLast24')} />
				</Field>
			</div>
			<Field id='stability.plannedRestructuring' label='Any planned restructuring or redundancy?' required error={errorMessage(form, 'stability.plannedRestructuring')}>
				<div id='stability.plannedRestructuring' tabIndex={-1} className='flex gap-4'>
					<label className='flex items-center gap-2 text-sm'><input type='radio' value='yes' {...form.register('stability.plannedRestructuring')} /> Yes</label>
					<label className='flex items-center gap-2 text-sm'><input type='radio' value='no' {...form.register('stability.plannedRestructuring')} /> No</label>
				</div>
			</Field>
			{planned === 'yes' ? (
				<Field id='stability.restructuringExplanation' label='Please explain' required error={errorMessage(form, 'stability.restructuringExplanation')}>
					<Textarea id='stability.restructuringExplanation' className='min-h-24' {...form.register('stability.restructuringExplanation')} />
				</Field>
			) : null}
			<Field id='stability.delayedSalaries' label='Any delayed salary payments in the last 12 months?' required error={errorMessage(form, 'stability.delayedSalaries')}>
				<div id='stability.delayedSalaries' tabIndex={-1} className='flex gap-4'>
					<label className='flex items-center gap-2 text-sm'><input type='radio' value='yes' {...form.register('stability.delayedSalaries')} /> Yes</label>
					<label className='flex items-center gap-2 text-sm'><input type='radio' value='no' {...form.register('stability.delayedSalaries')} /> No</label>
				</div>
			</Field>
			{delayed === 'yes' ? (
				<Field id='stability.delayedExplanation' label='Please explain' required error={errorMessage(form, 'stability.delayedExplanation')}>
					<Textarea id='stability.delayedExplanation' className='min-h-24' {...form.register('stability.delayedExplanation')} />
				</Field>
			) : null}
			<fieldset>
				<legend className='mb-2 text-sm font-medium text-charcoal'>
					Requested products <span className='text-destructive'>*</span>
				</legend>
				{errorMessage(form, 'stability.requestedProducts') ? (
					<p className='mb-2 text-sm text-destructive'>{errorMessage(form, 'stability.requestedProducts')}</p>
				) : null}
				<div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
					{REQUESTED_PRODUCTS.map((product) => (
						<label key={product} className='flex items-center gap-2 text-sm'>
							<input type='checkbox' checked={requested.includes(product)} onChange={() => toggleProduct(product)} />
							{product}
						</label>
					))}
				</div>
				<p className='mt-2 text-xs text-muted-foreground'>
					Insurance premium finance is collected here as an onboarding
					interest option. It is not currently listed as a public loan product.
				</p>
			</fieldset>
			<div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
				<Field id='stability.initialApplicants' label='Expected number of initial applicants' error={errorMessage(form, 'stability.initialApplicants')}>
					<Input id='stability.initialApplicants' inputMode='numeric' className={inputClassName(Boolean(errorMessage(form, 'stability.initialApplicants')))} {...form.register('stability.initialApplicants')} />
				</Field>
				<Field id='stability.estimatedMonthlyValue' label='Estimated monthly check-off value in KES'>
					<Input id='stability.estimatedMonthlyValue' inputMode='numeric' className={inputClassName()} {...form.register('stability.estimatedMonthlyValue')} />
				</Field>
			</div>
			<Field id='stability.existingLenders' label='Existing staff lenders or check-off providers'>
				<Textarea id='stability.existingLenders' className='min-h-20' {...form.register('stability.existingLenders')} />
			</Field>
			<Field id='stability.consentProcess' label='Employee consent process' required error={errorMessage(form, 'stability.consentProcess')}>
				<Textarea id='stability.consentProcess' className='min-h-20' {...form.register('stability.consentProcess')} />
			</Field>
			<Field id='stability.exitNotificationTimeline' label='Exit notification timeline to Enusha' required error={errorMessage(form, 'stability.exitNotificationTimeline')}>
				<Input id='stability.exitNotificationTimeline' placeholder='e.g. within 5 working days' className={inputClassName(Boolean(errorMessage(form, 'stability.exitNotificationTimeline')))} {...form.register('stability.exitNotificationTimeline')} />
			</Field>
		</div>
	)
}

export function MouStep ({ form }: StepProps) {
	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'mou.signatories',
	})

	return (
		<div className='space-y-6'>
			<div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
				<Field id='mou.legalName' label='Full legal name for the MOU' required error={errorMessage(form, 'mou.legalName')}>
					<Input id='mou.legalName' className={inputClassName(Boolean(errorMessage(form, 'mou.legalName')))} {...form.register('mou.legalName')} />
				</Field>
				<Field id='mou.noticesEmail' label='Official email for MOU notices' required error={errorMessage(form, 'mou.noticesEmail')}>
					<Input id='mou.noticesEmail' type='email' className={inputClassName(Boolean(errorMessage(form, 'mou.noticesEmail')))} {...form.register('mou.noticesEmail')} />
				</Field>
				<Field id='mou.noticesAddress' label='Registered office/address for notices' required error={errorMessage(form, 'mou.noticesAddress')}>
					<Textarea id='mou.noticesAddress' className='min-h-20 md:col-span-2' {...form.register('mou.noticesAddress')} />
				</Field>
				<Field id='mou.commencementDate' label='Proposed commencement date'>
					<Input id='mou.commencementDate' type='date' className={inputClassName()} {...form.register('mou.commencementDate')} />
				</Field>
				<Field id='mou.term' label='Proposed MOU term'>
					<Input id='mou.term' placeholder='e.g. 12 months' className={inputClassName()} {...form.register('mou.term')} />
				</Field>
			</div>
			<Field id='mou.specialClauses' label='Special requirements or clauses'>
				<Textarea id='mou.specialClauses' className='min-h-24' {...form.register('mou.specialClauses')} />
			</Field>
			<div className='flex items-center justify-between'>
				<h3 className='font-heading text-lg font-semibold text-charcoal'>Authorised signatories</h3>
				<Button type='button' variant='outline' className='h-9' onClick={() => append({
					fullName: '',
					jobTitle: '',
					email: '',
					telephone: '',
					signingAuthority: '',
				})}>
					Add signatory
				</Button>
			</div>
			{fields.map((field, index) => (
				<div key={field.id} className='rounded-xl border border-zinc-200 p-4'>
					<div className='mb-3 flex justify-end'>
						{fields.length > 1 ? (
							<Button type='button' variant='ghost' className='h-8 text-destructive' onClick={() => remove(index)}>Remove</Button>
						) : null}
					</div>
					<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
						<Field id={`mou.signatories.${index}.fullName`} label='Full name' required error={errorMessage(form, `mou.signatories.${index}.fullName`)}>
							<Input id={`mou.signatories.${index}.fullName`} className={inputClassName(Boolean(errorMessage(form, `mou.signatories.${index}.fullName`)))} {...form.register(`mou.signatories.${index}.fullName`)} />
						</Field>
						<Field id={`mou.signatories.${index}.jobTitle`} label='Job title' required error={errorMessage(form, `mou.signatories.${index}.jobTitle`)}>
							<Input id={`mou.signatories.${index}.jobTitle`} className={inputClassName(Boolean(errorMessage(form, `mou.signatories.${index}.jobTitle`)))} {...form.register(`mou.signatories.${index}.jobTitle`)} />
						</Field>
						<Field id={`mou.signatories.${index}.email`} label='Email' required error={errorMessage(form, `mou.signatories.${index}.email`)}>
							<Input id={`mou.signatories.${index}.email`} type='email' className={inputClassName(Boolean(errorMessage(form, `mou.signatories.${index}.email`)))} {...form.register(`mou.signatories.${index}.email`)} />
						</Field>
						<Field id={`mou.signatories.${index}.telephone`} label='Telephone' required error={errorMessage(form, `mou.signatories.${index}.telephone`)}>
							<Input id={`mou.signatories.${index}.telephone`} type='tel' className={inputClassName(Boolean(errorMessage(form, `mou.signatories.${index}.telephone`)))} {...form.register(`mou.signatories.${index}.telephone`)} />
						</Field>
						<Field id={`mou.signatories.${index}.signingAuthority`} label='Signing authority' required error={errorMessage(form, `mou.signatories.${index}.signingAuthority`)}>
							<Input id={`mou.signatories.${index}.signingAuthority`} className={inputClassName(Boolean(errorMessage(form, `mou.signatories.${index}.signingAuthority`)))} {...form.register(`mou.signatories.${index}.signingAuthority`)} />
						</Field>
					</div>
				</div>
			))}
		</div>
	)
}

export function DeclarationStep ({ form }: StepProps) {
	return (
		<div className='space-y-5'>
			<blockquote className='rounded-xl bg-cream px-5 py-4 text-sm leading-7 text-charcoal'>
				We certify that the information and documents provided are complete and
				accurate to the best of our knowledge. We authorise Enusha Capital Limited
				to verify the information supplied and use it for corporate onboarding,
				MOU preparation, due diligence, and administration of the check-off
				scheme. We undertake to notify Enusha of material changes affecting
				payroll, staff establishment, authorised contacts, or signatories.
			</blockquote>
			<div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
				<Field id='declaration.fullName' label='Declarant’s full name' required error={errorMessage(form, 'declaration.fullName')}>
					<Input id='declaration.fullName' className={inputClassName(Boolean(errorMessage(form, 'declaration.fullName')))} {...form.register('declaration.fullName')} />
				</Field>
				<Field id='declaration.jobTitle' label='Job title' required error={errorMessage(form, 'declaration.jobTitle')}>
					<Input id='declaration.jobTitle' className={inputClassName(Boolean(errorMessage(form, 'declaration.jobTitle')))} {...form.register('declaration.jobTitle')} />
				</Field>
				<Field id='declaration.email' label='Official company email' required error={errorMessage(form, 'declaration.email')}>
					<Input id='declaration.email' type='email' className={inputClassName(Boolean(errorMessage(form, 'declaration.email')))} {...form.register('declaration.email')} />
				</Field>
				<Field id='declaration.date' label='Date' required error={errorMessage(form, 'declaration.date')}>
					<Input id='declaration.date' type='date' className={inputClassName(Boolean(errorMessage(form, 'declaration.date')))} {...form.register('declaration.date')} />
				</Field>
			</div>
			<label className='flex items-start gap-3 text-sm text-charcoal'>
				<input id='declaration.accurate' type='checkbox' className='mt-1' {...form.register('declaration.accurate')} />
				<span>I accept the declaration above. {errorMessage(form, 'declaration.accurate') ? <span className='text-destructive'>{errorMessage(form, 'declaration.accurate')}</span> : null}</span>
			</label>
			<label className='flex items-start gap-3 text-sm text-charcoal'>
				<input id='declaration.authority' type='checkbox' className='mt-1' {...form.register('declaration.authority')} />
				<span>I confirm I have authority to submit this information. {errorMessage(form, 'declaration.authority') ? <span className='text-destructive'>{errorMessage(form, 'declaration.authority')}</span> : null}</span>
			</label>
			<label className='flex items-start gap-3 text-sm text-charcoal'>
				<input id='declaration.privacy' type='checkbox' className='mt-1' {...form.register('declaration.privacy')} />
				<span>I consent to the Privacy Notice for processing this onboarding information. {errorMessage(form, 'declaration.privacy') ? <span className='text-destructive'>{errorMessage(form, 'declaration.privacy')}</span> : null}</span>
			</label>
			<p className='text-xs text-muted-foreground'>
				This is an electronic acknowledgement. It is not a handwritten or
				qualified electronic signature.
			</p>
		</div>
	)
}
