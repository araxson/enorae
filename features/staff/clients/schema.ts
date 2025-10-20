import { z } from 'zod'

export const clientsSchema = z.object({})
export type ClientsSchema = z.infer<typeof clientsSchema>
