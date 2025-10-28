'use client'

import { Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

/**
 * Last Updated Timestamp Component
 *
 * Displays when the dashboard data was last loaded.
 * Updates the relative time every minute.
 *
 * @example
 * ```tsx
 * <LastUpdated />
 * ```
 */
export function LastUpdated() {
  const [lastUpdated] = useState(new Date())
  const [relativeTime, setRelativeTime] = useState('Just now')

  useEffect(() => {
    const updateRelativeTime = () => {
      const now = new Date()
      const diff = now.getTime() - lastUpdated.getTime()
      const MS_PER_MINUTE = 60000 // 1 minute in milliseconds
      const minutes = Math.floor(diff / MS_PER_MINUTE)

      if (minutes === 0) {
        setRelativeTime('Just now')
      } else if (minutes === 1) {
        setRelativeTime('1 minute ago')
      } else if (minutes < 60) {
        setRelativeTime(`${minutes} minutes ago`)
      } else {
        const hours = Math.floor(minutes / 60)
        setRelativeTime(hours === 1 ? '1 hour ago' : `${hours} hours ago`)
      }
    }

    // Update immediately
    updateRelativeTime()

    // Update every minute
    const UPDATE_INTERVAL_MS = 60000 // Update every 1 minute
    const interval = setInterval(updateRelativeTime, UPDATE_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [lastUpdated])

  return (
    <span className="flex items-center gap-1 text-sm text-muted-foreground">
      <Clock className="size-3" aria-hidden="true" />
      <span aria-label={`Last updated ${relativeTime}`}>{relativeTime}</span>
    </span>
  )
}
