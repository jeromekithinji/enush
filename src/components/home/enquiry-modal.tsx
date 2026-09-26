'use client'

import { type FormEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CircleCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, inputClassName } from '@/components/onboard/field'
import { cn } from '@/lib/utils'
import {
	defaultEnquiryValues,
	enquirySchema,
	type EnquiryValues,
} from '@/lib/enquiry/schema'

export function SpeakToTeamButton () {
	const [isOpen, setIsOpen] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [submitError, setSubmitError] = useState<string | null>(null)
	const form = useForm<EnquiryValues>({
		defaultValues: defaultEnquiryValues,
	})
	const errors = form.formState.errors
	const nameError = errors.name?.message
	const emailError = errors.email?.message
	const phoneError = errors.phone?.message
	const requestError = errors.request?.message

	function handleOpenChange (nextOpen: boolean) {
		setIsOpen(nextOpen)
		if (!nextOpen) {
			form.reset(defaultEnquiryValues)
			setIsSubmitted(false)
			setSubmitError(null)
			setIsSubmitting(false)
		}
	}

	async function handleSubmit (event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setSubmitError(null)
		form.clearErrors()

		const parsed = enquirySchema.safeParse(form.getValues())
		if (!parsed.success) {
			for (const issue of parsed.error.issues) {
				const path = issue.path[0]
				if (path === 'name' || path === 'email' || path === 'phone' || path === 'request') {
					form.setError(path, {
						type: 'manual',
						message: issue.message,
					})
				}
			}
			return
		}

		setIsSubmitting(true)
		try {
			const response = await fetch('/api/enquiry', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(parsed.data),
			})
			if (!response.ok) {
				setSubmitError('Something went wrong. Please try again.')
				return
			}
			setIsSubmitted(true)
			form.reset(defaultEnquiryValues)
		} catch {
			setSubmitError('A connection error occurred. Please try again.')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button
					type='button'
					variant='outline'
					className='h-12 w-full rounded-md border-white bg-transparent px-6 text-sm font-semibold text-white hover:bg-white/10 hover:text-white sm:w-auto'
				>
					Speak to the Enusha Team
				</Button>
			</DialogTrigger>
			<DialogContent>
				{isSubmitted ? (
					<div className='flex flex-col items-center px-2 py-6 text-center'>
						<CircleCheck
							aria-hidden='true'
							className='size-12 text-brand'
							strokeWidth={1.5}
						/>
						<DialogHeader className='mt-4 items-center pr-0'>
							<DialogTitle>Thank you</DialogTitle>
							<DialogDescription>
								Someone from the Enusha team will get back to you shortly.
							</DialogDescription>
						</DialogHeader>
						<Button
							type='button'
							className='mt-6 h-11 bg-brand px-6 text-white hover:bg-brand/90'
							onClick={() => handleOpenChange(false)}
						>
							Close
						</Button>
					</div>
				) : (
					<>
						<DialogHeader>
							<DialogTitle>Speak to the Enusha Team</DialogTitle>
							<DialogDescription>
								Share a few details and we will get back to you.
							</DialogDescription>
						</DialogHeader>
						<form
							className='flex flex-col gap-4'
							onSubmit={handleSubmit}
							noValidate
						>
							<Field
								id='enquiry-name'
								label='Name'
								required
								error={nameError}
							>
								<Input
									id='enquiry-name'
									autoComplete='name'
									className={inputClassName(Boolean(nameError))}
									{...form.register('name')}
								/>
							</Field>
							<Field
								id='enquiry-email'
								label='Email'
								required
								error={emailError}
							>
								<Input
									id='enquiry-email'
									type='email'
									autoComplete='email'
									className={inputClassName(Boolean(emailError))}
									{...form.register('email')}
								/>
							</Field>
							<Field
								id='enquiry-phone'
								label='Phone number'
								error={phoneError}
							>
								<Input
									id='enquiry-phone'
									type='tel'
									autoComplete='tel'
									className={inputClassName(Boolean(phoneError))}
									{...form.register('phone')}
								/>
							</Field>
							<Field
								id='enquiry-request'
								label='Request'
								required
								error={requestError}
							>
								<Textarea
									id='enquiry-request'
									rows={4}
									className={cn(
										'min-h-24 rounded-md border-zinc-200 text-sm',
										requestError && 'border-destructive',
									)}
									{...form.register('request')}
								/>
							</Field>
							{submitError ? (
								<p className='text-sm text-destructive'>{submitError}</p>
							) : null}
							<Button
								type='submit'
								disabled={isSubmitting}
								className='mt-1 h-11 bg-brand text-white hover:bg-brand/90'
							>
								{isSubmitting ? 'Sending…' : 'Submit'}
							</Button>
						</form>
					</>
				)}
			</DialogContent>
		</Dialog>
	)
}
