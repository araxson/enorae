import 'server-only'

export interface AdminMutationResult<T = undefined> {
  success: boolean
  data?: T
  error?: string
}

export const mutationSuccess = <T = undefined>(data?: T): AdminMutationResult<T> => ({
  success: true,
  ...(data !== undefined ? { data } : {}),
})

export const mutationFailure = (error: string): AdminMutationResult => ({
  success: false,
  error,
})
