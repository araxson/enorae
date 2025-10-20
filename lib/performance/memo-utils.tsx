'use client'

import { memo, useMemo, type ReactNode } from 'react'

/**
 * Memoization Utilities
 *
 * React.memo wrappers and memoization helpers
 */

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
 * Note: Additional deps can be passed for extra dependencies beyond data and sortFn
 */
export function useMemoizedSort<T>(
  data: T[],
  sortFn: (a: T, b: T) => number,
  deps: unknown[] = []
): T[] {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => [...data].sort(sortFn), [data, sortFn, ...deps])
}

/**
 * Hook for memoized filtering
 * Note: Additional deps can be passed for extra dependencies beyond data and filterFn
 */
export function useMemoizedFilter<T>(
  data: T[],
  filterFn: (item: T) => boolean,
  deps: unknown[] = []
): T[] {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => data.filter(filterFn), [data, filterFn, ...deps])
}

/**
 * Hook for memoized mapping
 * Note: Additional deps can be passed for extra dependencies beyond data and mapFn
 */
export function useMemoizedMap<T, R>(
  data: T[],
  mapFn: (item: T) => R,
  deps: unknown[] = []
): R[] {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => data.map(mapFn), [data, mapFn, ...deps])
}

/**
 * Memoized computation hook
 * Note: The computeFn should be stable or included in deps if it changes
 */
export function useMemoizedComputation<T>(
  computeFn: () => T,
  deps: unknown[]
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(computeFn, deps)
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
