'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface StatusFilterProps {
  value: string
  onChange: (value: string) => void
  options: Array<{ label: string; value: string }>
  placeholder?: string
  className?: string
}

export function StatusFilter({
  value,
  onChange,
  options,
  placeholder = 'All statuses',
  className,
}: StatusFilterProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
