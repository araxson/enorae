'use client'

import { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Search, ShieldAlert, X } from 'lucide-react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Field,
  FieldContent,
  FieldLabel,
} from '@/components/ui/field'
import { Item, ItemContent, ItemGroup } from '@/components/ui/item'
import { ButtonGroup } from '@/components/ui/button-group'

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
    <ItemGroup className="flex flex-col gap-4 lg:flex-row lg:items-center">
      <Item variant="muted" className="flex-1">
        <ItemContent>
          <InputGroup className="flex-1" aria-label="Search messages">
            <InputGroupAddon>
              <Search className="size-4 text-muted-foreground" aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              placeholder="Search messages..."
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value)
                onSearch(e.target.value)
              }}
              aria-label="Search messages"
              autoComplete="off"
            />
            <InputGroupAddon align="inline-end">
              {searchValue ? (
                <InputGroupButton
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Clear search"
                  onClick={() => {
                    setSearchValue('')
                    onSearch('')
                  }}
                >
                  <X className="size-4" aria-hidden="true" />
                </InputGroupButton>
              ) : null}
            </InputGroupAddon>
          </InputGroup>
        </ItemContent>
      </Item>
      <Item variant="muted">
        <ItemContent>
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
        <Field orientation="horizontal" className="items-center gap-2 rounded-md border px-3 py-2">
          <ShieldAlert className="size-4 text-destructive" aria-hidden="true" />
          <FieldLabel htmlFor="flagged-only">
            Flagged only
          </FieldLabel>
          <FieldContent className="flex-none">
            <Switch
              id="flagged-only"
              checked={flaggedOnly}
              onCheckedChange={(value) => {
                setFlaggedOnly(value)
                onFlaggedChange(value)
              }}
            />
          </FieldContent>
        </Field>
            <ButtonGroup>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all filters
              </Button>
            </ButtonGroup>
          </div>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
