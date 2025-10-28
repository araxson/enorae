'use client'

import { useId } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Kbd } from '@/components/ui/kbd'
import { cn } from '@/lib/utils'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'

interface SearchInputFieldProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  suggestions: { name: string; slug: string }[]
  focusedIndex: number
  setFocusedIndex: (index: number) => void
  suggestionsListId: string
  handleInputKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
  handleSearch: () => void
}

export function SearchInputField({
  searchTerm,
  setSearchTerm,
  suggestions,
  focusedIndex,
  setFocusedIndex,
  suggestionsListId,
  handleInputKeyDown,
  handleSearch,
}: SearchInputFieldProps) {
  const searchInputId = useId()
  const router = useRouter()

  return (
    <div className="relative">
      <Field>
        <FieldLabel htmlFor={searchInputId} className="sr-only">
          Search by salon name
        </FieldLabel>
        <FieldContent>
          <InputGroup>
            <InputGroupAddon>
              <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              id={searchInputId}
              placeholder="Search by salon name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleInputKeyDown}
              role="combobox"
              aria-haspopup="listbox"
              aria-autocomplete="list"
              aria-expanded={suggestions.length > 0}
              aria-controls={suggestions.length > 0 ? suggestionsListId : undefined}
              aria-activedescendant={
                focusedIndex >= 0 ? `${suggestionsListId}-option-${focusedIndex}` : undefined
              }
              autoComplete="off"
              aria-label="Search by salon name"
            />
            <InputGroupButton
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Run search"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </InputGroupButton>
          </InputGroup>
          <FieldDescription className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>Keyboard navigation:</span>
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            <span>to browse suggestions,</span>
            <Kbd>Enter</Kbd>
            <span>to select.</span>
          </FieldDescription>
        </FieldContent>
      </Field>

      {suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-10 mt-1">
          <Command aria-label="Salon suggestions">
            <CommandList id={suggestionsListId} role="listbox">
              <CommandGroup heading="Suggested salons">
                {suggestions.map((suggestion, index) => {
                  const optionId = `${suggestionsListId}-option-${index}`
                  const isFocused = focusedIndex === index

                  return (
                    <CommandItem
                      key={suggestion.slug}
                      id={optionId}
                      value={suggestion.slug}
                      aria-selected={isFocused}
                      data-selected={isFocused ? 'true' : undefined}
                      onMouseEnter={() => setFocusedIndex(index)}
                      onSelect={() => {
                        setSearchTerm(suggestion.name)
                        setFocusedIndex(-1)
                        router.push(`/customer/salons/${suggestion.slug}`)
                      }}
                      className={cn(isFocused && 'bg-muted text-foreground')}
                    >
                      {suggestion.name}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  )
}
