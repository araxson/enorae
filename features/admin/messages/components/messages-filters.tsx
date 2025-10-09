'use client'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Search, ShieldAlert } from 'lucide-react'

interface MessagesFiltersProps {
  onSearch: (value: string) => void
  onStatusChange: (value: string) => void
  onPriorityChange: (value: string) => void
  onFlaggedChange: (value: boolean) => void
}

export function MessagesFilters({
  onSearch,
  onStatusChange,
  onPriorityChange,
  onFlaggedChange,
}: MessagesFiltersProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search messages..."
          onChange={(e) => onSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Select defaultValue="all" onValueChange={onStatusChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all" onValueChange={onPriorityChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 rounded-md border px-3 py-2">
          <ShieldAlert className="h-4 w-4 text-amber-500" />
          <Label htmlFor="flagged-only" className="text-sm font-medium">
            Flagged only
          </Label>
          <Switch id="flagged-only" onCheckedChange={onFlaggedChange} />
        </div>
      </div>
    </div>
  )
}
