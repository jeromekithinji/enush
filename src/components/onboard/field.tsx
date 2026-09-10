import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react'
import { CircleAlert } from 'lucide-react'

import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FieldProps {
	id: string
	label: string
	required?: boolean
	error?: string
	children: ReactNode
}

export function Field ({
	id,
	label,
	required = false,
	error,
	children,
}: FieldProps) {
	const errorId = `${id}-error`
	const describedBy = error ? errorId : undefined
	const control = isValidElement(children)
		? cloneElement(
			children as ReactElement<{
				'aria-describedby'?: string
				'aria-invalid'?: boolean
			}>,
			{
				'aria-describedby': describedBy,
				'aria-invalid': Boolean(error) || undefined,
			},
		)
		: children

	return (
		<div className='flex flex-col gap-1.5'>
			<Label htmlFor={id} className='text-sm font-medium text-charcoal'>
				{label}
				{required ? (
					<span className='text-destructive'> *</span>
				) : (
					<span className='font-normal text-muted-foreground'> (optional)</span>
				)}
			</Label>
			{control}
			{error ? (
				<p
					id={errorId}
					className='flex items-center gap-1 text-sm text-destructive'
				>
					<CircleAlert className='size-3.5 shrink-0' aria-hidden='true' />
					{error}
				</p>
			) : null}
		</div>
	)
}

export function inputClassName (hasError?: boolean) {
	return cn(
		'h-11 rounded-md border-zinc-200 text-sm',
		hasError && 'border-destructive',
	)
}
