'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { Spinner } from '@/components/ui/spinner'
import { Item, ItemContent, ItemDescription, ItemGroup } from '@/components/ui/item'

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
    <div className="w-full max-w-sm pb-6" data-search-shortcut="cmd+k">
      <InputGroup aria-label={placeholder}>
        <InputGroupAddon>
          <Search className="size-4 text-muted-foreground" aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(event) => handleChange(event.target.value)}
          aria-describedby="admin-search-shortcut"
          autoComplete="off"
        />
        <InputGroupAddon align="inline-end" className="gap-2">
          {isSearching ? <Spinner className="text-muted-foreground" /> : null}
          {query ? (
            <InputGroupButton
              aria-label="Clear search"
              onClick={handleClear}
              variant="ghost"
              size="icon-sm"
            >
              <X className="size-4" aria-hidden="true" />
            </InputGroupButton>
          ) : null}
        </InputGroupAddon>
      </InputGroup>
      <ItemGroup
        id="admin-search-shortcut"
        className="mt-2 flex-wrap gap-2 text-xs text-muted-foreground"
        aria-live="polite"
      >
        <Item variant="muted" className="flex-wrap items-center gap-2">
          <ItemContent>
            {isSearching ? (
              <span className="flex items-center gap-1">
                <Spinner className="size-3" />
                Searching…
              </span>
            ) : (
              <ItemDescription>
                <span className="inline-flex items-center gap-2">
                  <span>Press</span>
                  <KbdGroup>
                    <Kbd>⌘</Kbd>
                    <Kbd>K</Kbd>
                  </KbdGroup>
                  <span className="text-muted-foreground/70">or</span>
                  <KbdGroup>
                    <Kbd>Ctrl</Kbd>
                    <Kbd>K</Kbd>
                  </KbdGroup>
                  <span>to focus search</span>
                </span>
              </ItemDescription>
            )}
          </ItemContent>
        </Item>
      </ItemGroup>
    </div>
  )
}
