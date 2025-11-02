import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, 'Please provide your name'),
  email: z.string().email('Please provide a valid email address'),
  phone: z.string().min(5).max(50).optional(),
  topic: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
})

export type ContactSchema = z.infer<typeof contactSchema>
