'use client'

import { Check, LoaderCircle, RotateCcw, Trash2, Upload } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	ACCEPTED_FILE_EXTENSIONS,
	ACCEPTED_FILE_LABEL,
	MAX_FILE_LABEL,
	type DocumentType,
} from '@/lib/onboard/constants'
import { cn } from '@/lib/utils'

export type UploadStatus = 'empty' | 'ready' | 'uploading' | 'success' | 'error'

export interface StagedDocument {
	file: File
	status: UploadStatus
	progress: number
	error?: string
}

interface DocumentUploadProps {
	documentType: DocumentType
	staged?: StagedDocument
	onSelect: (file: File) => void
	onRemove: () => void
	onRetry?: () => void
}

export function DocumentUpload ({
	documentType,
	staged,
	onSelect,
	onRemove,
	onRetry,
}: DocumentUploadProps) {
	const inputId = `document-${documentType.id}`

	function handleChange (event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0]
		event.target.value = ''
		if (file) {
			onSelect(file)
		}
	}

	return (
		<div
			id={inputId}
			tabIndex={-1}
			className='rounded-xl border border-zinc-200 p-4 outline-none focus-visible:ring-2 focus-visible:ring-brand/40'
		>
			<div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
				<div>
					<p className='text-sm font-medium text-charcoal'>
						{documentType.label}
						{documentType.required ? (
							<span className='text-destructive'> *</span>
						) : (
							<span className='font-normal text-muted-foreground'> (optional)</span>
						)}
					</p>
					<p className='mt-1 text-xs text-muted-foreground'>
						{ACCEPTED_FILE_LABEL}. Max {MAX_FILE_LABEL}.
					</p>
				</div>
				<div className='flex flex-wrap items-center gap-2'>
					<label
						htmlFor={`${inputId}-file`}
						className='inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-zinc-200 px-3 text-sm font-medium text-charcoal hover:bg-zinc-50'
					>
						<Upload className='size-4' aria-hidden='true' />
						{staged ? 'Replace' : 'Upload'}
					</label>
					<input
						id={`${inputId}-file`}
						type='file'
						className='sr-only'
						accept={ACCEPTED_FILE_EXTENSIONS.join(',')}
						onChange={handleChange}
					/>
					{staged ? (
						<Button
							type='button'
							variant='ghost'
							className='h-9 px-3 text-destructive'
							onClick={onRemove}
						>
							<Trash2 className='size-4' aria-hidden='true' />
							Remove
						</Button>
					) : null}
					{staged?.status === 'error' && onRetry ? (
						<Button
							type='button'
							variant='outline'
							className='h-9 px-3'
							onClick={onRetry}
						>
							<RotateCcw className='size-4' aria-hidden='true' />
							Retry
						</Button>
					) : null}
				</div>
			</div>
			{staged ? (
				<div className='mt-3'>
					<p className='text-sm text-charcoal'>{staged.file.name}</p>
					<p className='text-xs text-muted-foreground'>
						{(staged.file.size / (1024 * 1024)).toFixed(2)} MB
					</p>
					{staged.status === 'uploading' ? (
						<div className='mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-200'>
							<div
								className='h-full bg-brand transition-[width]'
								style={{ width: `${staged.progress}%` }}
							/>
						</div>
					) : null}
					<p
						className={cn(
							'mt-2 flex items-center gap-1 text-sm',
							staged.status === 'error'
								? 'text-destructive'
								: staged.status === 'ready' || staged.status === 'success'
									? 'text-emerald-700'
									: 'text-muted-foreground',
						)}
					>
						{staged.status === 'uploading' ? (
							<LoaderCircle className='size-3.5 animate-spin' aria-hidden='true' />
						) : null}
						{staged.status === 'ready' || staged.status === 'success' ? (
							<Check className='size-3.5' aria-hidden='true' />
						) : null}
						{staged.status === 'ready'
							? 'File ready. It will upload on submission.'
							: staged.status === 'uploading'
								? `Uploading ${staged.progress}%`
								: staged.status === 'success'
									? 'Uploaded'
									: staged.error}
					</p>
				</div>
			) : null}
		</div>
	)
}
