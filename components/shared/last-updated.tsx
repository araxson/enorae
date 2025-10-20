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
      const minutes = Math.floor(diff / 60000)

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
    const interval = setInterval(updateRelativeTime, 60000)

    return () => clearInterval(interval)
  }, [lastUpdated])

  return (
    <small className="text-sm font-medium leading-none flex items-center gap-1 text-muted-foreground">
      <Clock className="h-3 w-3" aria-hidden="true" />
      <span aria-label={`Last updated ${relativeTime}`}>{relativeTime}</span>
    </small>
  )
}
