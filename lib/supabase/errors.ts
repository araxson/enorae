const PERMISSION_DENIED_CODE = '42501'

function getErrorCode(error: unknown): string | undefined {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code?: string }).code
    return typeof code === 'string' ? code : undefined
  }
  return undefined
}

const loggedPermissionContexts = new Set<string>()

export function isPermissionDeniedError(error: unknown): boolean {
  return getErrorCode(error) === PERMISSION_DENIED_CODE
}

export function logSupabaseError(context: string, error: unknown): 'permission-denied' | 'error' {
  if (isPermissionDeniedError(error)) {
    if (!loggedPermissionContexts.has(context)) {
      console.warn(`[Supabase:RLS] ${context} blocked by row-level security. Returning fallback data.`)
      loggedPermissionContexts.add(context)
    }
    return 'permission-denied'
  }

  console.error(`[Supabase] ${context}:`, error)
  return 'error'
}
