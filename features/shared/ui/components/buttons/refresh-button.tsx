'use client'

import {
  useState,
  useTransition,
  type ComponentProps,
  type ComponentType,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

type IconComponent = ComponentType<{ className?: string; 'aria-hidden'?: boolean }>

interface RefreshButtonProps
  extends Omit<ComponentProps<typeof Button>, 'children' | 'onClick'> {
  /**
   * Optional async work to run before triggering a router refresh.
   */
  onRefresh?: () => void | Promise<void>
  /**
   * Text shown while idle when no `children` are provided.
   */
  idleLabel?: string
  /**
   * Text shown while refreshing.
   */
  loadingLabel?: string
  /**
   * Icon rendered while idle. Defaults to `RefreshCw`.
   */
  icon?: IconComponent
  /**
   * Accessible label announced to screen readers.
   */
  srLabel?: string
  children?: ReactNode
}

const DEFAULT_IDLE_LABEL = 'Refresh'
const DEFAULT_LOADING_LABEL = 'Refreshing...'

/**
 * Refresh Button Component
 *
 * Provides a consistent manual refresh affordance that handles async callbacks
 * and Next.js router refresh within a single primitive.
 */
export function RefreshButton({
  onRefresh,
  idleLabel = DEFAULT_IDLE_LABEL,
  loadingLabel = DEFAULT_LOADING_LABEL,
  icon: Icon = RefreshCw,
  srLabel = 'Refresh data',
  children,
  disabled,
  variant = 'outline',
  size = 'sm',
  ...buttonProps
}: RefreshButtonProps) {
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [, startTransition] = useTransition()

  const handleRefresh = () => {
    if (isRefreshing) return

    setIsRefreshing(true)

    startTransition(() => {
      Promise.resolve(onRefresh?.() ?? router.refresh())
        .catch((error) => {
          console.error('[RefreshButton] refresh failed', error)
        })
        .finally(() => setIsRefreshing(false))
    })
  }

  const content = children ?? idleLabel

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleRefresh}
      disabled={disabled || isRefreshing}
      aria-label={srLabel}
      {...buttonProps}
    >
      {isRefreshing ? (
        <>
          <Spinner aria-hidden="true" />
          <span>{loadingLabel}</span>
        </>
      ) : (
        <>
          <Icon className="size-4" aria-hidden="true" />
          <span>{content}</span>
        </>
      )}
    </Button>
  )
}
