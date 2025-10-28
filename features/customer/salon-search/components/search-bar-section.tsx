'use client'

import { Dispatch, SetStateAction } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Search } from 'lucide-react'
import { SearchFilters } from './search-filters'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Kbd } from '@/components/ui/kbd'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

interface SearchBarSectionProps {
  searchTerm: string
  setSearchTerm: Dispatch<SetStateAction<string>>
  city: string
  setCity: Dispatch<SetStateAction<string>>
  state: string
  setState: Dispatch<SetStateAction<string>>
  verifiedOnly: boolean
  setVerifiedOnly: Dispatch<SetStateAction<boolean>>
  minRating: string
  setMinRating: Dispatch<SetStateAction<string>>
  isSearching: boolean
  suggestionsOpen: boolean
  setSuggestionsOpen: Dispatch<SetStateAction<boolean>>
  suggestions: Array<{ slug: string; name: string }>
  resultsCount: number
  popularCities: { city: string; count: number }[]
  availableStates: string[]
  handleSearch: () => void
  handleSuggestionSelect: (slug: string) => void
}

export function SearchBarSection({
  searchTerm,
  setSearchTerm,
  city,
  setCity,
  state,
  setState,
  verifiedOnly,
  setVerifiedOnly,
  minRating,
  setMinRating,
  isSearching,
  suggestionsOpen,
  setSuggestionsOpen,
  suggestions,
  resultsCount,
  popularCities,
  availableStates,
  handleSearch,
  handleSuggestionSelect,
}: SearchBarSectionProps) {
  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item>
            <ItemMedia variant="icon">
              <Search className="size-5" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <CardTitle>Advanced Salon Search</CardTitle>
              <CardDescription>
                Find the perfect salon with advanced filters and fuzzy matching
              </CardDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Popover open={suggestionsOpen} onOpenChange={setSuggestionsOpen}>
            <PopoverTrigger asChild>
              <InputGroup>
                <InputGroupAddon>
                  <Search className="size-4 text-muted-foreground" aria-hidden="true" />
                </InputGroupAddon>
                <InputGroupInput
                  type="search"
                  placeholder="Search by salon name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setSuggestionsOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch()
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
                    onClick={handleSearch}
                    aria-label="Run search"
                  >
                    <Search className="size-4" aria-hidden="true" />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0">
              <Command>
                <CommandList>
                  <CommandEmpty>No matches found.</CommandEmpty>
                  <CommandGroup heading="Salons">
                    {suggestions.map((suggestion) => (
                      <CommandItem
                        key={suggestion.slug}
                        value={suggestion.name}
                        onSelect={() => handleSuggestionSelect(suggestion.slug)}
                      >
                        {suggestion.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <ItemGroup>
            <Item variant="muted" size="sm">
              <ItemContent>
                <ItemDescription>
                  <span className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>Tip:</span>
                    <Kbd>↑</Kbd>
                    <Kbd>↓</Kbd>
                    <span>to navigate suggestions,</span>
                    <Kbd>Esc</Kbd>
                    <span>to close.</span>
                  </span>
                </ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>

          <SearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            city={city}
            setCity={setCity}
            state={state}
            setState={setState}
            verifiedOnly={verifiedOnly}
            setVerifiedOnly={setVerifiedOnly}
            minRating={minRating}
            setMinRating={setMinRating}
            suggestions={[]}
            focusedIndex={-1}
            setFocusedIndex={() => {}}
            suggestionsListId=""
            handleInputKeyDown={() => {}}
            handleSearch={handleSearch}
            isSearching={isSearching}
            popularCities={popularCities}
            availableStates={availableStates}
          />

          <Button onClick={handleSearch} className="w-full" disabled={isSearching}>
            {isSearching ? (
              <>
                <Spinner className="mr-2" />
                Searching…
              </>
            ) : (
              'Search Salons'
            )}
          </Button>

          <ItemGroup>
            <Item variant="muted" size="sm">
              <ItemContent>
                <ItemDescription>
                  {resultsCount} {resultsCount === 1 ? 'matching salon' : 'matching salons'}
                </ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </div>
      </CardContent>
    </Card>
  )
}
