'use client'

import { Calendar as CalendarIcon } from 'lucide-react'
import { Muted } from '@/components/ui/typography'

export function DateRangeHeader({ start, end }: { start: string; end: string }) {
  return (
    <Muted className="flex items-center gap-2">
      <CalendarIcon className="h-4 w-4" />
      {new Date(start).toLocaleDateString()} - {new Date(end).toLocaleDateString()}
    </Muted>
  )
}
