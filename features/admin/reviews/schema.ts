import { z } from 'zod'

export const reviewsSchema = z.object({})
export type ReviewsSchema = z.infer<typeof reviewsSchema>
