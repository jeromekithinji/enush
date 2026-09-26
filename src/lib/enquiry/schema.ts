import { z } from 'zod'

export const enquirySchema = z.object({
	name: z.string().trim().min(1, 'Required').max(120),
	email: z.string().trim().email('Enter a valid email').max(120),
	phone: z.string().trim().max(40),
	request: z.string().trim().min(1, 'Required').max(2000),
})

export type EnquiryValues = z.infer<typeof enquirySchema>

export const defaultEnquiryValues: EnquiryValues = {
	name: '',
	email: '',
	phone: '',
	request: '',
}
