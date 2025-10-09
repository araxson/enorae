import { Button } from '@/components/ui/button'
import { Flex } from '@/components/layout/flex'
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
    <Flex gap="sm" className="w-full">
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
    </Flex>
  )
}
