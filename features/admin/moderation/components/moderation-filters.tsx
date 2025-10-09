'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type ModerationFiltersProps = {
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: string
  onStatusFilterChange: (status: string) => void
}

export function ModerationFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: ModerationFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-[220px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search reviews..."
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="All reviews" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All reviews</SelectItem>
          <SelectItem value="flagged">Flagged only</SelectItem>
          <SelectItem value="unflagged">Not flagged</SelectItem>
          <SelectItem value="pending">Pending response</SelectItem>
          <SelectItem value="responded">Has response</SelectItem>
          <SelectItem value="featured">Featured</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
