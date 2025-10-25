'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Search, ShieldAlert } from 'lucide-react'

declare global {
  interface WindowEventMap {
    'admin:clearFilters': CustomEvent<void>
  }
}

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
  const [searchValue, setSearchValue] = useState('')
  const [status, setStatus] = useState('all')
  const [priority, setPriority] = useState('all')
  const [flaggedOnly, setFlaggedOnly] = useState(false)

  const clearFilters = () => {
    setSearchValue('')
    setStatus('all')
    setPriority('all')
    setFlaggedOnly(false)
    onSearch('')
    onStatusChange('all')
    onPriorityChange('all')
    onFlaggedChange(false)
  }

  useEffect(() => {
    const handleClear = () => clearFilters()
    window.addEventListener('admin:clearFilters', handleClear)
    return () => window.removeEventListener('admin:clearFilters', handleClear)
  }, [onSearch, onStatusChange, onPriorityChange, onFlaggedChange])

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search messages..."
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value)
            onSearch(e.target.value)
          }}
          className="pl-9"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value)
            onStatusChange(value)
          }}
        >
          <SelectTrigger className="w-40">
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
        <Select
          value={priority}
          onValueChange={(value) => {
            setPriority(value)
            onPriorityChange(value)
          }}
        >
          <SelectTrigger className="w-40">
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
        <div className="flex items-center gap-2 px-3 py-2">
          <ShieldAlert className="h-4 w-4 text-destructive" />
          <Label htmlFor="flagged-only">
            Flagged only
          </Label>
          <Switch
            id="flagged-only"
            checked={flaggedOnly}
            onCheckedChange={(value) => {
              setFlaggedOnly(value)
              onFlaggedChange(value)
            }}
          />
        </div>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear all filters
        </Button>
      </div>
    </div>
  )
}
