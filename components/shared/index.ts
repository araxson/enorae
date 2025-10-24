/**
 * Shared Components
 *
 * Cross-portal reusable components organized by category.
 * All shared components are imported from their respective subdirectories.
 */

// Buttons
export { ActionButton } from './buttons/action-button'
export { RefreshButton } from './buttons/refresh-button'

// Data Display
export { StatCard } from './data-display/stat-card'
export { MetricsGrid } from './data-display/metrics-grid'

// Dialogs
export { ConfirmDialog } from './dialogs/confirm-dialog'

// Empty States
export { EmptyState } from './empty-states/empty-state'
export { DataTableEmpty } from './empty-states/data-table-empty'
export { NotFoundPage } from './empty-states/not-found-page'

// Error Handling
export { ErrorBoundary } from './error/error-boundary/error-boundary'

// Loading
export { PageLoading } from './loading/page-loading'
export { LoadingWrapper } from './loading/loading-wrapper'

// Search
export { SearchInput } from './search/search-input'

// Utils
export { LastUpdated } from './utils/last-updated'

// Type Exports
export type { StatCardProps } from './data-display/stat-card'
export type { EmptyStateProps } from './empty-states/empty-state'
export type { ErrorType } from './error/error-boundary/utils'
export type { ConfirmDialogProps } from './dialogs/confirm-dialog'
