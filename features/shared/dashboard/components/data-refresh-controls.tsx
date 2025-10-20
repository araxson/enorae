'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { RefreshCw, Clock, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type DataRefreshControlsProps = {
  generatedAt?: string
  className?: string
  buttonLabel?: string
  loadingLabel?: string
  tooltip?: string
}

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
  const [isPending, startTransition] = useTransition()
  const [relativeLabel, setRelativeLabel] = useState('Just now')

  const generatedDate = useMemo(
    () => (generatedAt ? new Date(generatedAt) : new Date()),
    [generatedAt]
  )

  useEffect(() => {
    const updateRelativeLabel = () => {
      const now = new Date()
      const diffMs = now.getTime() - generatedDate.getTime()
      const minutes = Math.round(diffMs / 60000)

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
    const interval = window.setInterval(updateRelativeLabel, 60000)

    return () => window.clearInterval(interval)
  }, [generatedDate])

  const handleRefresh = () => {
    startTransition(async () => {
      router.refresh()
    })
  }

  const button = (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleRefresh}
      disabled={isPending}
      className="gap-2"
      aria-label="Refresh dashboard data"
    >
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingLabel}
        </>
      ) : (
        <>
          <RefreshCw className="h-4 w-4" />
          {buttonLabel}
        </>
      )}
    </Button>
  )

  return (
    <div className={cn('flex items-center gap-3 text-muted-foreground', className)}>
      <p className="text-xs flex items-center gap-1">
        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
        <span aria-live="polite">{relativeLabel}</span>
      </p>
      <span className="hidden h-4 w-px bg-border sm:block" aria-hidden="true" />
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
