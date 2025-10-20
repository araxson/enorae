'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
  defaultValue?: string
}

const DEBOUNCE_MS = 400

export function SearchBar({ placeholder = 'Search...', onSearch, defaultValue = '' }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleClear = () => {
    setQuery('')
    onSearch('')
    inputRef.current?.focus()
  }

  const handleChange = (value: string) => {
    setQuery(value)
    setIsSearching(true)
    onSearch(value)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setIsSearching(false)
      timeoutRef.current = null
    }, DEBOUNCE_MS)
  }

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
      }

      if (event.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur()
      }
    }

    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('keydown', handler)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="relative w-full max-w-sm pb-6" data-search-shortcut="cmd+k">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(event) => handleChange(event.target.value)}
        className="pl-9 pr-9"
        aria-label={placeholder}
      />
      {query && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </Button>
      )}
      <span className="absolute -bottom-6 left-0 text-xs text-muted-foreground" aria-live="polite">
        {isSearching ? 'Searching…' : 'Press ⌘K / Ctrl+K to focus search'}
      </span>
    </div>
  )
}
