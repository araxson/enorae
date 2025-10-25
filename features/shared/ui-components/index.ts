/**
 * Shared UI Components
 *
 * Cross-portal reusable components organized by category.
 * All shared components are imported from their respective subdirectories.
 */

// Buttons
export { ActionButton } from './components/buttons/action-button'
export { RefreshButton } from './components/buttons/refresh-button'

// Data Display
export { StatCard } from './components/data-display/stat-card'
export { MetricsGrid } from './components/data-display/metrics-grid'

// Dialogs
export { ConfirmDialog } from './components/dialogs/confirm-dialog'

// Empty States
export { EmptyState } from './components/empty-states/empty-state'
export { DataTableEmpty } from './components/empty-states/data-table-empty'
export { NotFoundPage } from './components/empty-states/not-found-page'

// Error Handling
export { ErrorBoundary } from './components/error/error-boundary/error-boundary'

// Loading
export { PageLoading } from './components/loading/page-loading'
export { LoadingWrapper } from './components/loading/loading-wrapper'

// Search
export { SearchInput } from './components/search/search-input'

// Utils
export { LastUpdated } from './components/utils/last-updated'

// Type Exports
export type { StatCardProps } from './components/data-display/stat-card'
export type { EmptyStateProps } from './components/empty-states/empty-state'
export type { ErrorType } from './components/error/error-boundary/utils'
export type { ConfirmDialogProps } from './components/dialogs/confirm-dialog'
