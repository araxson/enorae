'use client'

import { Calendar as CalendarIcon } from 'lucide-react'

export function DateRangeHeader({ start, end }: { start: string; end: string }) {
  return (
    <p className="text-sm text-muted-foreground flex items-center gap-2">
      <CalendarIcon className="h-4 w-4" aria-hidden="true" />
      {new Date(start).toLocaleDateString()} - {new Date(end).toLocaleDateString()}
    </p>
  )
}
