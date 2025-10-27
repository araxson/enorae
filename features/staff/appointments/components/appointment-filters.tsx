'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
type AppointmentFiltersProps = {
  onSearchChange?: (search: string) => void
  onStatusChange: (status: string) => void
  searchValue?: string
  showSearch?: boolean
}

export function AppointmentFilters({
  onSearchChange,
  onStatusChange,
  searchValue,
  showSearch = true,
}: AppointmentFiltersProps) {
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
            placeholder="Search by customer name or email..."
            value={searchValue ?? localSearch}
            onChange={(event) => handleSearchChange(event.target.value)}
          />
        </InputGroup>
      ) : null}
      <Select onValueChange={onStatusChange} defaultValue="all">
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="confirmed">Confirmed</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
          <SelectItem value="no_show">No Show</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
