import type { ReactNode } from 'react'

/**
 * Performance Monitoring
 *
 * Tools for measuring and monitoring component performance
 */

/**
 * Performance monitoring component
 * Only active in development mode
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
