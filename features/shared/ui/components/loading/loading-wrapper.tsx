import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

interface LoadingWrapperProps {
  isLoading?: boolean
  children: React.ReactNode
}

/**
 * Loading Wrapper Component
 *
 * Wraps content with a lightweight loading veil that preserves component
 * semantics without introducing custom styling beyond opacity changes.
 */
export function LoadingWrapper({ isLoading = false, children }: LoadingWrapperProps) {
  return (
    <div
      className="relative"
      role="status"
      aria-live="polite"
      aria-busy={isLoading}
    >
      <div
        className={cn(
          'transition-opacity',
          isLoading && 'pointer-events-none opacity-50'
        )}
        aria-hidden={isLoading}
      >
        {children}
      </div>
      {isLoading ? (
        <div className="absolute inset-0 grid place-items-center">
          <Spinner aria-hidden="true" />
          <span className="sr-only">Loading content...</span>
        </div>
      ) : null}
    </div>
  )
}
