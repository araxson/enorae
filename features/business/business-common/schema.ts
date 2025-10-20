import { z } from 'zod'

export const businessCommonSchema = z.object({})
export type BusinessCommonSchema = z.infer<typeof businessCommonSchema>
