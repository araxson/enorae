'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'
import { Flex } from '@/components/layout'

type ClientFiltersProps = {
  onSearchChange?: (search: string) => void
  onSortChange: (sort: string) => void
  searchValue?: string
  showSearch?: boolean
}

export function ClientFilters({
  onSearchChange,
  onSortChange,
  searchValue,
  showSearch = true,
}: ClientFiltersProps) {
  const [localSearch, setLocalSearch] = useState(searchValue ?? '')

  const handleSearchChange = (value: string) => {
    setLocalSearch(value)
    onSearchChange?.(value)
  }

  return (
    <Flex gap="md" className="flex-col sm:flex-row">
      {showSearch ? (
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchValue ?? localSearch}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="pl-10"
          />
        </div>
      ) : null}
      <Select onValueChange={onSortChange} defaultValue="appointments">
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="appointments">Most Appointments</SelectItem>
          <SelectItem value="revenue">Highest Revenue</SelectItem>
          <SelectItem value="recent">Most Recent</SelectItem>
          <SelectItem value="name">Name (A-Z)</SelectItem>
        </SelectContent>
      </Select>
    </Flex>
  )
}
