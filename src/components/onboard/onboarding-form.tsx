'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	DocumentUpload,
	type StagedDocument,
} from '@/components/onboard/document-upload'
import { OnboardReview } from '@/components/onboard/review'
import {
	AddressStep,
	CompanyDetailsStep,
	ContactsStep,
	DeclarationStep,
	MouStep,
	PayrollStep,
	StabilityStep,
	WorkforceStep,
} from '@/components/onboard/steps'
import { DOCUMENT_TYPES, ONBOARD_STEPS } from '@/lib/onboard/constants'
import {
	clearOnboardDraft,
	loadOnboardDraft,
	rememberSubmittedReference,
	saveOnboardDraft,
} from '@/lib/onboard/draft'
import { validateUpload } from '@/lib/onboard/files'
import { describeFieldPath } from '@/lib/onboard/labels'
import {
	defaultOnboardValues,
	onboardFormSchema,
	stepSchemas,
	type OnboardFormValues,
} from '@/lib/onboard/schema'
import { cn } from '@/lib/utils'

type FormView = 'form' | 'review' | 'success'
type BannerKind =
	| 'draft'
	| 'autosave'
	| 'validation'
	| 'connection'
	| 'upload'
	| 'expired'
	| 'duplicate'
	| 'backend'
	| 'partial'

interface BannerState {
	kind: BannerKind
	message: string
}

interface SuccessState {
	reference: string
	submittedAt: string
	emailQueued: boolean
}

const SECTION_KEYS = [
	'company',
	'address',
	'contacts',
	'workforce',
	'payroll',
	'stability',
	'mou',
	'documents',
	'declaration',
] as const

function formatClock (timestamp: number) {
	return new Date(timestamp).toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	})
}

function flattenIssues (issues: { path: PropertyKey[], message: string }[], prefix?: string) {
	return issues.map((issue) => {
		const path = [...(prefix ? [prefix] : []), ...issue.path.map(String)]
			.filter(Boolean)
			.join('.')
		return {
			path,
			message: issue.message,
			label: describeFieldPath(path),
		}
	})
}

function submitWithProgress (
	formData: FormData,
	onProgress: (percent: number) => void,
): Promise<{ ok: boolean, status: number, body: Record<string, unknown> }> {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest()
		xhr.open('POST', '/api/onboard')
		xhr.upload.onprogress = (event) => {
			if (event.lengthComputable) {
				onProgress(Math.round((event.loaded / event.total) * 100))
			}
		}
		xhr.onload = () => {
			let body: Record<string, unknown> = {}
			try {
				body = JSON.parse(xhr.responseText) as Record<string, unknown>
			} catch {
				body = { message: 'The server returned an unexpected response.' }
			}
			resolve({
				ok: xhr.status >= 200 && xhr.status < 300,
				status: xhr.status,
				body,
			})
		}
		xhr.onerror = () => reject(new Error('connection'))
		xhr.ontimeout = () => reject(new Error('connection'))
		xhr.timeout = 120000
		xhr.send(formData)
	})
}

export function OnboardingForm () {
	const [step, setStep] = useState(0)
	const [view, setView] = useState<FormView>('form')
	const [savedAt, setSavedAt] = useState<number | null>(null)
	const [banner, setBanner] = useState<BannerState | null>(null)
	const [stepErrors, setStepErrors] = useState<
		{ path: string, message: string, label: string }[]
	>([])
	const [documents, setDocuments] = useState<Record<string, StagedDocument>>({})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [success, setSuccess] = useState<SuccessState | null>(null)
	const [hydrated, setHydrated] = useState(false)
	const [maxReached, setMaxReached] = useState(0)
	const errorSummaryRef = useRef<HTMLDivElement>(null)
	const formTopRef = useRef<HTMLDivElement>(null)
	const saveTimer = useRef<number | null>(null)
	const restoredRef = useRef(false)

	const form = useForm<OnboardFormValues>({
		defaultValues: defaultOnboardValues,
		mode: 'onSubmit',
		reValidateMode: 'onChange',
	})

	const persistDraft = useCallback((nextStep = step) => {
		try {
			const savedAtValue = Date.now()
			saveOnboardDraft({
				savedAt: savedAtValue,
				step: nextStep,
				data: form.getValues(),
			})
			setSavedAt(savedAtValue)
		} catch {
			setBanner({
				kind: 'partial',
				message:
					'Your answers are still on this page, but the draft could not be saved in this browser. Do not close the tab until you submit.',
			})
		}
	}, [form, step])

	useEffect(() => {
		const draft = loadOnboardDraft()
		if (draft) {
			form.reset(draft.data)
			const restoredStep = Math.min(Math.max(draft.step, 0), ONBOARD_STEPS.length - 1)
			setStep(restoredStep)
			setMaxReached(restoredStep)
			setSavedAt(draft.savedAt)
			restoredRef.current = true
			setBanner({
				kind: 'draft',
				message:
					'A saved draft was restored. Supporting documents are not stored in the browser and must be uploaded again before submission.',
			})
		}
		setHydrated(true)
	}, [form])

	useEffect(() => {
		if (stepErrors.length > 0) {
			errorSummaryRef.current?.focus()
		}
	}, [stepErrors])

	useEffect(() => {
		if (!hydrated) {
			return
		}

		const subscription = form.watch(() => {
			if (saveTimer.current) {
				window.clearTimeout(saveTimer.current)
			}
			saveTimer.current = window.setTimeout(() => {
				persistDraft()
				if (!restoredRef.current) {
					setBanner((current) =>
						current?.kind === 'draft' ? current : {
							kind: 'autosave',
							message: 'Draft saved on this device. Files are not included.',
						},
					)
				}
				restoredRef.current = false
			}, 700)
		})

		return () => {
			subscription.unsubscribe()
			if (saveTimer.current) {
				window.clearTimeout(saveTimer.current)
			}
		}
	}, [form, hydrated, persistDraft])

	const currentTitle = ONBOARD_STEPS[step]?.label ?? 'Review'
	const documentNames = useMemo(() => {
		const names: Record<string, string> = {}
		for (const [id, staged] of Object.entries(documents)) {
			names[id] = staged.file.name
		}
		return names
	}, [documents])

	function focusErrors () {
		window.setTimeout(() => {
			errorSummaryRef.current?.focus()
		}, 0)
	}

	function handleSelectDocument (id: string, file: File) {
		const error = validateUpload(file)
		if (error) {
			setDocuments((current) => ({
				...current,
				[id]: {
					file,
					status: 'error',
					progress: 0,
					error,
				},
			}))
			setBanner({ kind: 'upload', message: error })
			return
		}
		setDocuments((current) => ({
			...current,
			[id]: {
				file,
				status: 'ready',
				progress: 0,
			},
		}))
		setBanner(null)
	}

	function handleRemoveDocument (id: string) {
		setDocuments((current) => {
			const next = { ...current }
			delete next[id]
			return next
		})
	}

	function scrollToForm () {
		formTopRef.current?.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		})
	}

	function applyZodErrors (
		prefix: string,
		issues: { path: PropertyKey[], message: string }[],
	) {
		const flattened = flattenIssues(issues, prefix)
		for (const item of flattened) {
			form.setError(item.path as never, {
				type: 'manual',
				message: item.message,
			})
		}
		setStepErrors(flattened)
		setBanner({
			kind: 'validation',
			message: 'Please correct the highlighted fields before continuing.',
		})
		focusErrors()
	}

	function handleContinue () {
		if (view === 'review') {
			return
		}

		setBanner(null)
		setStepErrors([])

		if (step === 7) {
			const missing = DOCUMENT_TYPES.filter(
				(documentType) =>
					documentType.required &&
					(!documents[documentType.id] ||
						documents[documentType.id].status === 'error'),
			)
			if (missing.length > 0) {
				const errors = missing.map((documentType) => ({
					path: `document-${documentType.id}`,
					message: 'Required',
					label: documentType.label,
				}))
				setStepErrors(errors)
				setBanner({
					kind: 'validation',
					message: 'Please attach the required supporting documents.',
				})
				focusErrors()
				return
			}
			persistDraft(8)
			setStep(8)
			setMaxReached((current) => Math.max(current, 8))
			scrollToForm()
			return
		}

		const schema = stepSchemas[step]
		if (!schema) {
			return
		}

		const sectionKey = SECTION_KEYS[step]
		const sectionValues = form.getValues()[sectionKey as Exclude<typeof sectionKey, 'documents'>]
		const result = schema.safeParse(sectionValues)
		if (!result.success) {
			applyZodErrors(sectionKey, result.error.issues)
			return
		}

		form.clearErrors()
		if (step === 8) {
			persistDraft(8)
			setView('review')
			scrollToForm()
			return
		}

		const nextStep = step + 1
		persistDraft(nextStep)
		setStep(nextStep)
		setMaxReached((current) => Math.max(current, nextStep))
		scrollToForm()
	}

	function handleBack () {
		setBanner(null)
		setStepErrors([])
		if (view === 'review') {
			setView('form')
			setStep(8)
			scrollToForm()
			return
		}
		if (step === 0) {
			return
		}
		setStep(step - 1)
		scrollToForm()
	}

	function handleEdit (nextStep: number) {
		if (view === 'form' && nextStep > maxReached) {
			return
		}
		setView('form')
		setStep(nextStep)
		setBanner(null)
		setStepErrors([])
		scrollToForm()
	}

	async function handleSubmit () {
		setBanner(null)
		setStepErrors([])

		const values = form.getValues()
		const parsed = onboardFormSchema.safeParse(values)
		if (!parsed.success) {
			setView('form')
			setStep(0)
			applyZodErrors('', parsed.error.issues)
			return
		}

		const missing = DOCUMENT_TYPES.filter(
			(documentType) =>
				documentType.required &&
				(!documents[documentType.id] ||
					documents[documentType.id].status === 'error'),
		)
		if (missing.length > 0) {
			handleEdit(7)
			const errors = missing.map((documentType) => ({
				path: `document-${documentType.id}`,
				message: 'Required',
				label: documentType.label,
			}))
			setStepErrors(errors)
			setBanner({
				kind: 'validation',
				message: 'Please attach the required supporting documents.',
			})
			return
		}

		setIsSubmitting(true)
		setDocuments((current) => {
			const next: Record<string, StagedDocument> = {}
			for (const [id, staged] of Object.entries(current)) {
				next[id] = { ...staged, status: 'uploading', progress: 0, error: undefined }
			}
			return next
		})

		const formData = new FormData()
		formData.set('payload', JSON.stringify(parsed.data))
		for (const [id, staged] of Object.entries(documents)) {
			formData.append(`file:${id}`, staged.file, staged.file.name)
		}

		try {
			const result = await submitWithProgress(formData, (percent) => {
				setDocuments((current) => {
					const next: Record<string, StagedDocument> = {}
					for (const [id, staged] of Object.entries(current)) {
						next[id] = { ...staged, progress: percent }
					}
					return next
				})
			})

			if (result.status === 409) {
				setBanner({
					kind: 'duplicate',
					message:
						typeof result.body.message === 'string'
							? result.body.message
							: 'A submission for this company already exists. Your answers have been kept.',
				})
				setDocuments((current) => markDocuments(current, 'ready'))
				setIsSubmitting(false)
				return
			}

			if (result.status === 401) {
				setBanner({
					kind: 'expired',
					message:
						'This session is no longer valid. Your answers are still on this page. Refresh only if you have a saved draft, or continue submitting.',
				})
				setDocuments((current) => markDocuments(current, 'ready'))
				setIsSubmitting(false)
				return
			}

			if (!result.ok) {
				if (result.body.code === 'upload') {
					setBanner({
						kind: 'upload',
						message:
							typeof result.body.message === 'string'
								? result.body.message
								: 'One or more files could not be uploaded. Your answers have been kept.',
					})
				} else {
					setBanner({
						kind: 'backend',
						message:
							typeof result.body.message === 'string'
								? result.body.message
								: 'The submission could not be received. Your answers have been kept.',
					})
				}
				setDocuments((current) => markDocuments(current, 'error', 'Upload failed. You can retry submission.'))
				setIsSubmitting(false)
				return
			}

			const reference = String(result.body.reference ?? '')
			const submittedAt = String(result.body.submittedAt ?? new Date().toISOString())
			const emailQueued = Boolean(result.body.emailQueued)
			if (!reference) {
				setBanner({
					kind: 'backend',
					message:
						'The server did not return a submission reference. Your answers have been kept.',
				})
				setDocuments((current) => markDocuments(current, 'ready'))
				setIsSubmitting(false)
				return
			}

			setDocuments((current) => markDocuments(current, 'success', undefined, 100))
			rememberSubmittedReference(reference)
			clearOnboardDraft()
			setSuccess({ reference, submittedAt, emailQueued })
			setView('success')
			scrollToForm()
		} catch {
			setBanner({
				kind: 'connection',
				message:
					'A connection error occurred. Check your network and try again. Your answers have been kept.',
			})
			setDocuments((current) => markDocuments(current, 'error', 'Connection lost. Retry submission.'))
		} finally {
			setIsSubmitting(false)
		}
	}

	function handlePrint () {
		window.print()
	}

	function handleDownloadSummary () {
		if (!success) {
			return
		}
		const values = form.getValues()
		const lines = [
			`Enusha corporate onboarding submission ${success.reference}`,
			`Received: ${new Date(success.submittedAt).toLocaleString()}`,
			'',
			`Company: ${values.company.registeredName}`,
			`Registration: ${values.company.registrationNumber}`,
			`KRA PIN: ${values.company.kraPin}`,
			`Declarant: ${values.declaration.fullName} (${values.declaration.jobTitle})`,
			`Email: ${values.declaration.email}`,
			'',
			'This summary is a record of the information submitted. Submission does not constitute approval or activation of the scheme.',
		]
		const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = `${success.reference}-summary.txt`
		link.click()
		URL.revokeObjectURL(url)
	}

	const progressPercent = view === 'review' || view === 'success'
		? 100
		: ((step + 1) / ONBOARD_STEPS.length) * 100

	return (
		<div ref={formTopRef} className='mx-auto w-full max-w-5xl scroll-mt-28'>
			<div className='print:hidden'>
				<div className='mb-2 flex items-end justify-between gap-4'>
					<p className='text-sm font-medium text-charcoal'>
						{view === 'review'
							? 'Review before submission'
							: view === 'success'
								? 'Submission received'
								: `Step ${step + 1} of ${ONBOARD_STEPS.length}`}
					</p>
					<p className='text-xs text-muted-foreground'>
						{savedAt && view !== 'success' ? `Auto-saved ${formatClock(savedAt)}` : null}
					</p>
				</div>
				<div
					className='mb-4 h-1.5 overflow-hidden rounded-full bg-zinc-200'
					role='progressbar'
					aria-valuemin={1}
					aria-valuemax={ONBOARD_STEPS.length}
					aria-valuenow={view === 'form' ? step + 1 : ONBOARD_STEPS.length}
					aria-label='Onboarding progress'
				>
					<div
						className='h-full bg-brand transition-[width] duration-300'
						style={{ width: `${progressPercent}%` }}
					/>
				</div>
				<nav
					className='mb-8 hidden w-full items-end justify-between gap-1 text-[11px] whitespace-nowrap lg:flex xl:gap-2 xl:text-xs'
					aria-label='Form sections'
				>
					{ONBOARD_STEPS.map((item, index) => {
						const isCurrent = view === 'form' && index === step
						return (
							<button
								key={item.id}
								type='button'
								className={cn(
									'shrink-0 border-b-2 pb-1 transition-colors',
									isCurrent
										? 'border-brand font-medium text-brand'
										: 'border-transparent text-zinc-400 hover:text-charcoal',
								)}
								aria-current={isCurrent ? 'step' : undefined}
								onClick={() => handleEdit(index)}
							>
								{item.label}
							</button>
						)
					})}
				</nav>
			</div>

			{banner && view !== 'success' ? (
				<div
					ref={banner.kind === 'validation' ? errorSummaryRef : undefined}
					tabIndex={-1}
					role={banner.kind === 'validation' ? 'alert' : 'status'}
					className={cn(
						'mb-6 rounded-xl px-4 py-3 text-sm print:hidden',
						banner.kind === 'autosave' || banner.kind === 'draft'
							? 'border border-zinc-200 bg-white text-charcoal'
							: banner.kind === 'duplicate' || banner.kind === 'partial'
								? 'border border-amber-300 bg-amber-50 text-amber-950'
								: 'border border-destructive/30 bg-red-50 text-destructive',
					)}
				>
					<p>{banner.message}</p>
					{stepErrors.length > 0 ? (
						<>
							<p className='mt-2 font-medium'>
								{stepErrors.length} {stepErrors.length === 1 ? 'issue' : 'issues'} to fix:
							</p>
							<ul className='mt-1 list-disc space-y-1 pl-5'>
								{stepErrors.map((error) => (
									<li key={`${error.path}-${error.message}`}>
										<a
											href={`#${error.path}`}
											className='underline underline-offset-2'
											onClick={(event) => {
												event.preventDefault()
												document.getElementById(error.path)?.focus()
											}}
										>
											{error.label}: {error.message}
										</a>
									</li>
								))}
							</ul>
						</>
					) : null}
				</div>
			) : null}

			{view === 'success' && success ? (
				<div id='onboard-summary' className='rounded-2xl border border-zinc-200 bg-white p-6 md:p-10'>
					<p className='text-sm font-medium text-brand'>Submission reference {success.reference}</p>
					<h2 className='mt-2 font-heading text-3xl font-semibold text-charcoal'>
						Thank you
					</h2>
					<p className='mt-4 max-w-3xl text-sm leading-7 text-charcoal'>
						Thank you. Your corporate onboarding information has been received.
						Our team will review the submission and contact the authorised
						representatives provided. Submission does not constitute approval or
						activation of the scheme.
					</p>
					{success.emailQueued ? (
						<p className='mt-3 text-sm text-muted-foreground'>
							A confirmation email will be sent to the declarant’s official company email.
						</p>
					) : (
						<p className='mt-3 text-sm text-muted-foreground'>
							Keep this reference for your records. A confirmation email is sent
							only when a transactional email service is configured.
						</p>
					)}
					<div className='mt-6 print:hidden flex flex-wrap gap-3'>
						<Button type='button' className='h-11 px-5' onClick={handlePrint}>
							Print summary
						</Button>
						<Button type='button' variant='outline' className='h-11 px-5' onClick={handleDownloadSummary}>
							Download summary
						</Button>
					</div>
					<div className='mt-8'>
						<OnboardReview
							values={form.getValues()}
							documentNames={documentNames}
						/>
					</div>
				</div>
			) : (
				<div className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm md:p-8'>
					{view === 'review' ? (
						<>
							<h2 className='mb-6 font-heading text-2xl font-semibold text-charcoal md:text-3xl'>
								Review your information
							</h2>
							<OnboardReview
								values={form.watch()}
								documentNames={documentNames}
								onEdit={handleEdit}
							/>
						</>
					) : (
						<>
							<h2 className='mb-6 font-heading text-2xl font-semibold text-charcoal md:text-3xl'>
								{currentTitle}
							</h2>
							{step === 0 ? <CompanyDetailsStep form={form} /> : null}
							{step === 1 ? <AddressStep form={form} /> : null}
							{step === 2 ? <ContactsStep form={form} /> : null}
							{step === 3 ? <WorkforceStep form={form} /> : null}
							{step === 4 ? <PayrollStep form={form} /> : null}
							{step === 5 ? <StabilityStep form={form} /> : null}
							{step === 6 ? <MouStep form={form} /> : null}
							{step === 7 ? (
								<div className='space-y-4'>
									<p className='text-sm text-muted-foreground'>
										Accepted formats: PDF, DOC, DOCX, XLS, XLSX, JPG, and PNG.
										Maximum size per file: 10 MB. Files are uploaded securely on
										submission and are not stored in browser local storage.
									</p>
									{DOCUMENT_TYPES.map((documentType) => (
										<DocumentUpload
											key={documentType.id}
											documentType={documentType}
											staged={documents[documentType.id]}
											onSelect={(file) => handleSelectDocument(documentType.id, file)}
											onRemove={() => handleRemoveDocument(documentType.id)}
											onRetry={() => {
												const staged = documents[documentType.id]
												if (staged) {
													handleSelectDocument(documentType.id, staged.file)
												}
											}}
										/>
									))}
								</div>
							) : null}
							{step === 8 ? <DeclarationStep form={form} /> : null}
						</>
					)}
				</div>
			)}

			{view !== 'success' ? (
				<div className='mt-6 flex items-center justify-between print:hidden'>
					<Button
						type='button'
						variant='outline'
						className='h-11 px-5'
						onClick={handleBack}
						disabled={view === 'form' && step === 0}
					>
						<ChevronLeft className='size-4' aria-hidden='true' />
						Back
					</Button>
					{view === 'review' ? (
						<Button
							type='button'
							className='h-11 bg-brand px-5 text-white hover:bg-brand/90'
							onClick={() => {
								void handleSubmit()
							}}
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Submitting…' : 'Submit Corporate Onboarding Information'}
						</Button>
					) : (
						<Button
							type='button'
							className='h-11 bg-brand px-5 text-white hover:bg-brand/90'
							onClick={handleContinue}
						>
							Continue
							<ChevronRight className='size-4' aria-hidden='true' />
						</Button>
					)}
				</div>
			) : null}
		</div>
	)
}

function markDocuments (
	current: Record<string, StagedDocument>,
	status: StagedDocument['status'],
	error?: string,
	progress?: number,
) {
	const next: Record<string, StagedDocument> = {}
	for (const [id, staged] of Object.entries(current)) {
		next[id] = {
			...staged,
			status,
			error,
			progress: progress ?? staged.progress,
		}
	}
	return next
}
