/**
 * Performance Optimization Utilities
 *
 * Tools for optimizing React component performance
 *
 * Organization:
 * - memo-utils.tsx: Memoization helpers (useMemo, React.memo wrappers)
 * - callback-utils.ts: Callback optimization (useCallback, debouncing)
 * - monitoring.tsx: Performance monitoring components
 * - use-virtualization.ts: Virtual scrolling for large lists
 */

// Memoization utilities
export * from './memo-utils'

// Callback utilities
export * from './callback-utils'

// Performance monitoring
export * from './monitoring'

// Virtualization (already separate file)
export { useVirtualization } from './use-virtualization'
