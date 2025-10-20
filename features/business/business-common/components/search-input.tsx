'use client'

import { useEffect, useId, useState } from 'react'
import { Search, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SearchInputProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  debounceMs?: number
  label?: string
  inputId?: string
}

export function SearchInput({
  value: controlledValue,
  onChange,
  placeholder = 'Search...',
  className,
  debounceMs = 300,
  label,
  inputId,
}: SearchInputProps) {
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
    <div className={`relative ${className || ''}`}>
      <Label htmlFor={resolvedId} className="sr-only">
        {accessibleLabel}
      </Label>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <Input
        id={resolvedId}
        aria-label={accessibleLabel}
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9"
      />
      {internalValue && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  )
}
