'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia } from '@/components/ui/item'
import { TIME_MS } from '@/lib/config/constants'

export function LastUpdated() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, TIME_MS.ONE_MINUTE)

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
