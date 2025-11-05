'use client'
import { SearchInput } from '@/features/shared/ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

type FilterControlsProps = {
  searchQuery: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
}

export function AppointmentsFilterControls({ searchQuery, onSearchChange, statusFilter, onStatusChange }: FilterControlsProps) {
  return (
    <div className="mt-4">
      <div className="flex gap-4 items-center flex-col sm:flex-row">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search by customer, staff, or date..."
          className="flex-1"
        />
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
