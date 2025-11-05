'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'

import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DataRefreshControlsProps } from '@/features/shared/dashboard/api/types'
import { TIME_MS } from '@/lib/config/constants'
import { RefreshButton } from '@/features/shared/ui'

const DEFAULT_LOADING = 'Refreshing...'
const DEFAULT_LABEL = 'Refresh'

export function DataRefreshControls({
  generatedAt,
  className,
  buttonLabel = DEFAULT_LABEL,
  loadingLabel = DEFAULT_LOADING,
  tooltip,
}: DataRefreshControlsProps) {
  const router = useRouter()
  const [relativeLabel, setRelativeLabel] = useState('Just now')

  const generatedDate = useMemo(
    () => (generatedAt ? new Date(generatedAt) : new Date()),
    [generatedAt]
  )

  useEffect(() => {
    const updateRelativeLabel = () => {
      const now = new Date()
      const diffMs = now.getTime() - generatedDate.getTime()
      const minutes = Math.round(diffMs / TIME_MS.ONE_MINUTE)

      if (minutes <= 0) {
        setRelativeLabel('Updated just now')
      } else if (minutes === 1) {
        setRelativeLabel('Updated 1 minute ago')
      } else if (minutes < 60) {
        setRelativeLabel(`Updated ${minutes} minutes ago`)
      } else {
        const hours = Math.round(minutes / 60)
        setRelativeLabel(hours === 1 ? 'Updated 1 hour ago' : `Updated ${hours} hours ago`)
      }
    }

    updateRelativeLabel()
    const interval = window.setInterval(updateRelativeLabel, TIME_MS.ONE_MINUTE)

    return () => window.clearInterval(interval)
  }, [generatedDate])

  const button = (
    <RefreshButton
      idleLabel={buttonLabel}
      loadingLabel={loadingLabel}
      onRefresh={() => router.refresh()}
      srLabel="Refresh dashboard data"
    />
  )

  return (
    <div className={cn('flex items-center gap-3 text-muted-foreground', className)}>
      <p className="flex items-center gap-1 text-xs">
        <Clock className="size-3.5" aria-hidden="true" />
        <span aria-live="polite">{relativeLabel}</span>
      </p>
      <div className="hidden h-4 items-center sm:flex">
        <Separator orientation="vertical" decorative />
      </div>
      {tooltip ? (
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        button
      )}
    </div>
  )
}
