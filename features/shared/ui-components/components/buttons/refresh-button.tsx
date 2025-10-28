'use client'

import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface RefreshButtonProps {
  /**
   * Optional callback to execute before refresh
   */
  onRefresh?: () => void | Promise<void>
}

/**
 * Refresh Button Component
 *
 * Provides a manual refresh functionality for dashboards.
 * Uses Next.js router refresh to re-fetch server component data.
 *
 * @example
 * ```tsx
 * <RefreshButton />
 * ```
 */
export function RefreshButton({ onRefresh }: RefreshButtonProps) {
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)

    try {
      // Execute optional callback
      if (onRefresh) {
        await onRefresh()
      }

      // Refresh the current route to re-fetch data
      router.refresh()
    } catch (error) {
      console.error('[RefreshButton] Error refreshing:', error)
    } finally {
      // Reset loading state after a short delay to show feedback
      setTimeout(() => {
        setIsRefreshing(false)
      }, 500)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRefresh}
      disabled={isRefreshing}
      aria-label="Refresh dashboard data"
    >
      {isRefreshing ? <Spinner /> : <RefreshCw className="size-4" />}
      {isRefreshing ? 'Refreshing...' : 'Refresh'}
    </Button>
  )
}
