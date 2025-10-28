import { Button } from '@/components/ui/button'
import { RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'
import { ButtonGroup } from '@/components/ui/button-group'

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
    <ButtonGroup aria-label="Actions">
      <div className="flex-1">
        <Button onClick={reset} variant="default" disabled={isLoading}>
          <RefreshCw className="size-4" />
          <span>Try Again</span>
        </Button>
      </div>
      <div className="flex-1">
        <Button asChild variant="outline">
          <Link href={homeHref}>
            <Home className="size-4" />
            <span>{homeLabel}</span>
          </Link>
        </Button>
      </div>
    </ButtonGroup>
  )
}
