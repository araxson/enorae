import { useCallback, useMemo, useRef } from 'react'

/**
 * Callback Utilities
 *
 * useCallback wrappers and callback optimization helpers
 */

/**
 * Debounced callback hook
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => callback(...args), delay)
    },
    [callback, delay]
  )
}

/**
 * Stable callback hook (prevents callback recreation)
 * Note: This intentionally uses an empty dependency array to prevent recreation.
 * The callback reference may become stale - use with caution.
 */
export function useStableCallback<T extends (...args: unknown[]) => unknown>(
  callback: T
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(callback, [])
}

/**
 * Batch state updates
 */
export function useBatchedUpdates() {
  const updates = useMemo(() => new Map<string, unknown>(), [])

  const queueUpdate = useCallback(
    (key: string, value: unknown) => {
      updates.set(key, value)
    },
    [updates]
  )

  const flushUpdates = useCallback(
    (callback: (updates: Map<string, unknown>) => void) => {
      callback(updates)
      updates.clear()
    },
    [updates]
  )

  return { queueUpdate, flushUpdates }
}
