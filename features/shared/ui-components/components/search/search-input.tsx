'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'

interface SearchInputProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  debounceMs?: number
}

export function SearchInput({
  value: controlledValue,
  onChange,
  placeholder = 'Search...',
  className,
  debounceMs = 300,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(controlledValue || '')

  // Debounce the onChange callback
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(internalValue)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [internalValue, debounceMs, onChange])

  // Update internal value when controlled value changes
  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue)
    }
  }, [controlledValue])

  const handleClear = () => {
    setInternalValue('')
    onChange('')
  }

  return (
    <div className={className}>
      <InputGroup>
      <InputGroupAddon>
        <Search className="size-4 text-muted-foreground" aria-hidden="true" />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        value={internalValue}
        onChange={(event) => setInternalValue(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        autoComplete="off"
      />
      {internalValue ? (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            variant="ghost"
            size="icon-sm"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X className="size-4" aria-hidden="true" />
          </InputGroupButton>
        </InputGroupAddon>
      ) : null}
      </InputGroup>
    </div>
  )
}
