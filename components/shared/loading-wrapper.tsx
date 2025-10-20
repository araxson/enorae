import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface LoadingWrapperProps {
  loading: boolean
  error?: Error | null
  children: React.ReactNode
  skeleton?: React.ReactNode
  onRetry?: () => void
}

/**
 * LoadingWrapper Component
 *
 * Handles loading, error, and success states consistently.
 * Provides a consistent spinner during loading and error recovery options.
 *
 * @example
 * ```tsx
 * <LoadingWrapper
 *   loading={isLoading}
 *   error={error}
 *   skeleton={<PageLoading />}
 *   onRetry={refetch}
 * >
 *   <DashboardContent data={data} />
 * </LoadingWrapper>
 * ```
 */
export function LoadingWrapper({
  loading,
  error,
  children,
  skeleton,
  onRetry,
}: LoadingWrapperProps) {
  if (loading) {
    return skeleton ? (
      <>{skeleton}</>
    ) : (
      <div className="flex justify-center py-12">
        <Spinner className="size-8 text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <div className="flex items-center justify-between gap-4">
          <AlertDescription>
            {error.message || 'Failed to load data. Please try again.'}
          </AlertDescription>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          )}
        </div>
      </Alert>
    )
  }

  return <>{children}</>
}
