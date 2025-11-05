'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type FilterBarProps = {
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  onTypeChange: (value: string) => void
}

export function FilterBar({ onSearchChange, onStatusChange, onTypeChange }: FilterBarProps) {
  return (
    <div className="flex gap-4 mb-4">
      <Input
        placeholder="Search..."
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-xs"
      />
      <Select onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>
      <Select onValueChange={onTypeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="review">Review</SelectItem>
          <SelectItem value="report">Report</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
