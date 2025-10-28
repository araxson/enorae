'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldDescription,
} from '@/components/ui/field'

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
    <FieldGroup>
      {showSearch ? (
        <Field>
          <FieldContent>
            <InputGroup>
              <InputGroupAddon>
                <Search className="size-4" aria-hidden="true" />
              </InputGroupAddon>
          <InputGroupInput
            type="search"
            placeholder="Search by name or email..."
            value={searchValue ?? localSearch}
            onChange={(event) => handleSearchChange(event.target.value)}
            aria-label="Search clients"
            autoComplete="off"
          />
            </InputGroup>
            <FieldDescription>Search across client names and email addresses.</FieldDescription>
          </FieldContent>
        </Field>
      ) : null}
      <Field>
        <FieldContent>
          <Select onValueChange={onSortChange} defaultValue="appointments">
            <SelectTrigger aria-label="Sort clients">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="appointments">Most Appointments</SelectItem>
              <SelectItem value="revenue">Highest Revenue</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
          <FieldDescription>Choose the ordering for your client list.</FieldDescription>
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}
