'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { Muted } from '@/components/ui/typography'
import { formatDistanceToNow } from 'date-fns'

export function LastUpdated() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <Muted className="flex items-center gap-1 text-xs">
      <Clock className="h-3 w-3" />
      Updated {formatDistanceToNow(time, { addSuffix: true })}
    </Muted>
  )
}
