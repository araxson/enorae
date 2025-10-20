import { z } from 'zod'

import { reviewSchema } from '@/lib/validations/customer/reviews'

export const customerReviewSchema = reviewSchema
export type CustomerReviewInput = z.infer<typeof customerReviewSchema>
