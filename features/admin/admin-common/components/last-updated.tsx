'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia } from '@/components/ui/item'

export function LastUpdated() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 60000) // Update every 1 minute (60000ms)

    return () => clearInterval(interval)
  }, [])

  return (
    <ItemGroup>
      <Item variant="muted" size="sm" className="items-center gap-2">
        <ItemMedia variant="icon">
          <Clock className="size-3" />
        </ItemMedia>
        <ItemContent>
          <ItemDescription>
            Updated {formatDistanceToNow(time, { addSuffix: true })}
          </ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
