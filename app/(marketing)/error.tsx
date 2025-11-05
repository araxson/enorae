'use client'

import { ErrorBoundary } from '@/features/shared/ui'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorBoundary
      error={error}
      reset={reset}
      homeHref="/"
      homeLabel="Home"
    />
  )
}
