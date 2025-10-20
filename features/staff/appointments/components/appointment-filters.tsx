'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'
import { Flex } from '@/components/layout'

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
    <Flex gap="md" className="flex-col sm:flex-row">
      {showSearch ? (
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer name or email..."
            value={searchValue ?? localSearch}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="pl-10"
          />
        </div>
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
    </Flex>
  )
}
