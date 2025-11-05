'use client'

import { useEffect, useId, useState } from 'react'
import { Search, X } from 'lucide-react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import { cn } from '@/lib/utils/index'

interface SearchFilterProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  debounceMs?: number
  label?: string
  inputId?: string
}

export function SearchFilter({
  value: controlledValue,
  onChange,
  placeholder = 'Search...',
  className,
  debounceMs = 300,
  label,
  inputId,
}: SearchFilterProps) {
  const generatedId = useId()
  const resolvedId = inputId ?? generatedId
  const accessibleLabel = label ?? placeholder ?? 'Search'
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
    <Field className={cn('relative', className)}>
      {label && <FieldLabel htmlFor={resolvedId}>{accessibleLabel}</FieldLabel>}
      <FieldContent>
        <InputGroup>
          <InputGroupAddon>
            <Search className="size-4" aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            id={resolvedId}
            type="search"
            aria-label={accessibleLabel}
            value={internalValue}
            onChange={(e) => setInternalValue(e.target.value)}
            placeholder={placeholder}
            autoComplete="off"
          />
          {internalValue ? (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={handleClear}
                aria-label="Clear search"
              >
                <X className="size-4" />
              </InputGroupButton>
            </InputGroupAddon>
          ) : null}
        </InputGroup>
      </FieldContent>
    </Field>
  )
}
