import { memo, useMemo, useCallback, type ReactNode } from 'react'
export { useVirtualization } from './use-virtualization'

/**
 * Memoized list component to prevent unnecessary re-renders
 * Use this when rendering lists of items
 */
export const MemoizedList = memo(function MemoizedList<T>({
  items,
  renderItem,
  keyExtractor,
}: {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  keyExtractor: (item: T, index: number) => string
}) {
  return (
    <>
      {items.map((item, index) => (
        <div key={keyExtractor(item, index)}>{renderItem(item, index)}</div>
      ))}
    </>
  )
})

/**
 * Hook for memoized sorting
 */
export function useMemoizedSort<T>(
  data: T[],
  sortFn: (a: T, b: T) => number,
  deps: unknown[] = []
): T[] {
  return useMemo(() => [...data].sort(sortFn), [data, ...deps])
}

/**
 * Hook for memoized filtering
 */
export function useMemoizedFilter<T>(
  data: T[],
  filterFn: (item: T) => boolean,
  deps: unknown[] = []
): T[] {
  return useMemo(() => data.filter(filterFn), [data, ...deps])
}

/**
 * Hook for memoized mapping
 */
export function useMemoizedMap<T, R>(
  data: T[],
  mapFn: (item: T) => R,
  deps: unknown[] = []
): R[] {
  return useMemo(() => data.map(mapFn), [data, ...deps])
}

/**
 * Debounced callback hook
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  return useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout
      return (...args: Parameters<T>) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => callback(...args), delay)
      }
    })(),
    [callback, delay]
  )
}

/**
 * Memoized computation hook
 */
export function useMemoizedComputation<T>(
  computeFn: () => T,
  deps: unknown[]
): T {
  return useMemo(computeFn, deps)
}

/**
 * Stable callback hook (prevents callback recreation)
 */
export function useStableCallback<T extends (...args: unknown[]) => unknown>(
  callback: T
): T {
  return useCallback(callback, [])
}

/**
 * Performance monitoring component
 */
export function PerformanceMonitor({
  name,
  children,
}: {
  name: string
  children: ReactNode
}) {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now()
    const result = children
    const end = performance.now()
    const renderTime = end - start

    if (renderTime > 16) {
      // Longer than one frame (60fps)
      console.warn(
        `[Performance] ${name} took ${renderTime.toFixed(2)}ms to render (>16ms)`
      )
    }
    return result
  }

  return children
}

/**
 * HOC for expensive components
 */
export function withMemoization<P extends object>(
  Component: React.ComponentType<P>,
  arePropsEqual?: (prevProps: P, nextProps: P) => boolean
) {
  return memo(Component, arePropsEqual)
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
