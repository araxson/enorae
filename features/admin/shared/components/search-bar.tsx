'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Box } from '@/components/layout'

interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
  defaultValue?: string
}

export function SearchBar({ placeholder = 'Search...', onSearch, defaultValue = '' }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  const handleChange = (value: string) => {
    setQuery(value)
    // Real-time search with debouncing (client-side)
    onSearch(value)
  }

  return (
    <Box className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        className="pl-9 pr-9"
      />
      {query && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </Box>
  )
}
