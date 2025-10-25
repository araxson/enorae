import { Spinner } from '@/components/ui/spinner'

interface LoadingWrapperProps {
  isLoading?: boolean
  children: React.ReactNode
}

/**
 * Loading Wrapper Component
 *
 * Wraps content with a loading overlay when loading.
 *
 * @example
 * ```tsx
 * <LoadingWrapper isLoading={isLoading}>
 *   <YourContent />
 * </LoadingWrapper>
 * ```
 */
export function LoadingWrapper({ isLoading = false, children }: LoadingWrapperProps) {
  if (!isLoading) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm">
        <Spinner />
      </div>
    </div>
  )
}
