'use server'

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export type ThreadMetadata = Record<string, unknown> & {
  notes?: Array<{
    id: string
    content: string
    created_by: string
    created_at: string
  }>
}
