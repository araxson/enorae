import { Button } from '@/components/ui/button'
import { RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export function ErrorBoundaryActions({
  reset,
  homeHref,
  homeLabel,
  isLoading,
}: {
  reset: () => void
  homeHref: string
  homeLabel: string
  isLoading: boolean
}) {
  return (
    <div className="flex w-full gap-6">
      <Button onClick={reset} variant="default" className="flex-1 gap-2" disabled={isLoading}>
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
      <Button asChild variant="outline" className="flex-1 gap-2">
        <Link href={homeHref}>
          <Home className="h-4 w-4" />
          {homeLabel}
        </Link>
      </Button>
    </div>
  )
}
