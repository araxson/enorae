'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export function LastUpdated() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 60000) // Update every 1 minute (60000ms)

    return () => clearInterval(interval)
  }, [])

  return (
    <p className="text-xs text-muted-foreground flex items-center gap-1">
      <Clock className="h-3 w-3" />
      Updated {formatDistanceToNow(time, { addSuffix: true })}
    </p>
  )
}
