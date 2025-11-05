'use client'

import { Dispatch, SetStateAction } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Search } from 'lucide-react'
import { SearchFilters } from './search-filters'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Kbd } from '@/components/ui/kbd'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
} from '@/components/ui/item'
import { SearchInputField } from './search-input-field'
import { SearchSuggestionsPopover } from './search-suggestions-popover'

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
          <SearchSuggestionsPopover
            open={suggestionsOpen}
            setOpen={setSuggestionsOpen}
            suggestions={suggestions}
            onSelect={handleSuggestionSelect}
          >
            <SearchInputField
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onFocus={() => setSuggestionsOpen(true)}
              onSearch={handleSearch}
            />
          </SearchSuggestionsPopover>

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

          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? (
              <>
                <Spinner className="size-4" />
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
