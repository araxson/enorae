'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Flex } from '@/components/layout'

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
    <Flex gap="md" align="center" className="flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search reviews..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>

      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Reviews" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Reviews</SelectItem>
          <SelectItem value="flagged">Flagged Only</SelectItem>
          <SelectItem value="unflagged">Not Flagged</SelectItem>
          <SelectItem value="pending">Pending Response</SelectItem>
          <SelectItem value="responded">Has Response</SelectItem>
          <SelectItem value="featured">Featured</SelectItem>
        </SelectContent>
      </Select>
    </Flex>
  )
}
