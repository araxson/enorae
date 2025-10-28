'use client'

import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { SearchInputField } from './filters/search-input-field'
import { LocationFilters } from './filters/location-filters'
import { QualityFilters } from './filters/quality-filters'

interface SearchFiltersProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  city: string
  setCity: (value: string) => void
  state: string
  setState: (value: string) => void
  verifiedOnly: boolean
  setVerifiedOnly: (value: boolean) => void
  minRating: string
  setMinRating: (value: string) => void
  suggestions: { name: string; slug: string }[]
  focusedIndex: number
  setFocusedIndex: (index: number) => void
  suggestionsListId: string
  handleInputKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
  handleSearch: () => void
  isSearching: boolean
  popularCities: { city: string; count: number }[]
  availableStates: string[]
}

export function SearchFilters({
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
  suggestions,
  focusedIndex,
  setFocusedIndex,
  suggestionsListId,
  handleInputKeyDown,
  handleSearch,
  isSearching,
  popularCities,
  availableStates,
}: SearchFiltersProps) {
  return (
    <Item variant="outline" className="flex-col gap-6">
      <ItemHeader>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <ItemMedia variant="icon">
              <Search className="h-5 w-5" aria-hidden="true" />
            </ItemMedia>
            <ItemTitle>Advanced Salon Search</ItemTitle>
          </div>
          <ItemDescription>
            Find the perfect salon with advanced filters and fuzzy matching
          </ItemDescription>
        </div>
      </ItemHeader>
      <ItemContent>
        <div className="flex flex-col gap-4">
          <SearchInputField
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            suggestions={suggestions}
            focusedIndex={focusedIndex}
            setFocusedIndex={setFocusedIndex}
            suggestionsListId={suggestionsListId}
            handleInputKeyDown={handleInputKeyDown}
            handleSearch={handleSearch}
          />

          <FieldSet>
            <FieldLegend className="sr-only">Search filters</FieldLegend>
            <FieldGroup className="gap-4 md:grid md:grid-cols-2 lg:grid-cols-4">
              <LocationFilters
                city={city}
                setCity={setCity}
                state={state}
                setState={setState}
                popularCities={popularCities}
                availableStates={availableStates}
              />
              <QualityFilters
                verifiedOnly={verifiedOnly}
                setVerifiedOnly={setVerifiedOnly}
                minRating={minRating}
                setMinRating={setMinRating}
              />
            </FieldGroup>
          </FieldSet>

          <Button variant="default" onClick={handleSearch} className="w-full" disabled={isSearching}>
            {isSearching ? (
              <>
                <Spinner className="mr-2" />
                Searching…
              </>
            ) : (
              'Search Salons'
            )}
          </Button>
        </div>
      </ItemContent>
    </Item>
  )
}
