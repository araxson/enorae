import { z } from 'zod'

export const usersSchema = z.object({})
export type UsersSchema = z.infer<typeof usersSchema>
