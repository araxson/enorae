'use client'

import { Search, X } from 'lucide-react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className,
}: SearchInputProps) {
  return (
    <InputGroup className={className}>
      <InputGroupAddon>
        <Search className="size-4 text-muted-foreground" aria-hidden="true" />
      </InputGroupAddon>
  <InputGroupInput
    type="search"
    placeholder={placeholder}
    value={value}
    onChange={(event) => onChange(event.target.value)}
    aria-label={placeholder}
    autoComplete="off"
  />
      {value ? (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            variant="ghost"
            size="icon-sm"
            aria-label="Clear search"
            onClick={() => onChange('')}
          >
            <X className="size-4" aria-hidden="true" />
          </InputGroupButton>
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  )
}
