'use client'

import { Dispatch, SetStateAction } from 'react'
import { Search } from 'lucide-react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'

interface SearchInputFieldProps {
  searchTerm: string
  setSearchTerm: Dispatch<SetStateAction<string>>
  onFocus: () => void
  onSearch: () => void
}

export function SearchInputField({
  searchTerm,
  setSearchTerm,
  onFocus,
  onSearch,
}: SearchInputFieldProps) {
  return (
    <InputGroup>
      <InputGroupAddon>
        <Search className="size-4 text-muted-foreground" aria-hidden="true" />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        placeholder="Search by salon name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={onFocus}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSearch()
          }
        }}
        aria-label="Search salons"
        autoComplete="off"
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onSearch}
          aria-label="Run search"
        >
          <Search className="size-4" aria-hidden="true" />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
