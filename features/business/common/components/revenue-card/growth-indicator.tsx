'use client'

import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Growth indicator component showing trend direction
 */
export function GrowthIndicator({ growthRate }: { growthRate?: number }) {
  if (growthRate === undefined) return null

  const isPositive = growthRate >= 0

  return (
    <div className="flex gap-2 items-center">
      {isPositive ? (
        <ArrowUpRight className="size-3 text-primary" aria-hidden="true" />
      ) : (
        <ArrowDownRight className="size-3 text-destructive" aria-hidden="true" />
      )}
      <div
        className={cn(
          'text-xs font-medium',
          isPositive ? 'text-primary' : 'text-destructive'
        )}
      >
        {isPositive ? 'Growth' : 'Decline'} vs. previous period
      </div>
    </div>
  )
}
