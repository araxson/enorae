'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
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
    <div className="flex gap-4 flex-col sm:flex-row">
      {showSearch ? (
        <InputGroup className="flex-1">
          <InputGroupAddon>
            <Search className="h-4 w-4" aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search by name or email..."
            value={searchValue ?? localSearch}
            onChange={(event) => handleSearchChange(event.target.value)}
          />
        </InputGroup>
      ) : null}
      <Select onValueChange={onSortChange} defaultValue="appointments">
        <SelectTrigger className="w-full sm:w-52">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="appointments">Most Appointments</SelectItem>
          <SelectItem value="revenue">Highest Revenue</SelectItem>
          <SelectItem value="recent">Most Recent</SelectItem>
          <SelectItem value="name">Name (A-Z)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
