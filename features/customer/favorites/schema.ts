import { z } from 'zod'

import { favoriteSchema } from '@/lib/validations/customer/favorites'

export const toggleFavoriteSchema = favoriteSchema
export type ToggleFavoriteInput = z.infer<typeof toggleFavoriteSchema>
