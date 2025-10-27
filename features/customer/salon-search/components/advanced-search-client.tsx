'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Search, Sparkles, TrendingUp } from 'lucide-react'
import type { SalonSearchResult } from '@/features/customer/salon-search/api/queries'
import { SalonCard } from './salon-card'
import { useSearchSuggestions } from './use-search-suggestions'
import { SearchFilters } from './search-filters'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'
import { Kbd } from '@/components/ui/kbd'
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia } from '@/components/ui/item'

interface AdvancedSearchClientProps {
  initialResults: SalonSearchResult[]
  popularCities: { city: string; count: number }[]
  availableStates: string[]
  featuredSalons: SalonSearchResult[]
}

export function AdvancedSearchClient({
  initialResults,
  popularCities,
  availableStates,
  featuredSalons,
}: AdvancedSearchClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [state, setState] = useState(searchParams.get('state') || '')
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get('verified') === 'true')
  const [minRating, setMinRating] = useState(searchParams.get('rating') || '')
  const [results, setResults] = useState<SalonSearchResult[]>(initialResults)
  const [isSearching, setIsSearching] = useState(false)
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)

  const { suggestions } = useSearchSuggestions(searchTerm)

  const handleSearch = useCallback(() => {
    setIsSearching(true)

    const params = new URLSearchParams()
    if (searchTerm) params.set('q', searchTerm)
    if (city) params.set('city', city)
    if (state) params.set('state', state)
    if (verifiedOnly) params.set('verified', 'true')
    if (minRating) params.set('rating', minRating)

    router.push(`/customer/search?${params.toString()}`)
  }, [searchTerm, city, state, verifiedOnly, minRating, router])

  const handleSuggestionSelect = (slug: string) => {
    setSuggestionsOpen(false)
    router.push(`/customer/salons/${slug}`)
  }

  const handleSuggestionOpenChange = (open: boolean) => {
    setSuggestionsOpen(open)
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Search Bar with Advanced Filters */}
      <Card>
        <CardHeader>
          <ItemGroup>
            <Item>
              <ItemMedia variant="icon">
                <Search className="h-5 w-5" aria-hidden="true" />
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
            {/* Search Term with Suggestions */}
            <Popover open={suggestionsOpen} onOpenChange={handleSuggestionOpenChange}>
              <PopoverTrigger asChild>
                <InputGroup>
                  <InputGroupAddon>
                    <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </InputGroupAddon>
                  <InputGroupInput
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
                  />
                  <InputGroupButton
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={handleSearch}
                    aria-label="Run search"
                  >
                    <Search className="h-4 w-4" aria-hidden="true" />
                  </InputGroupButton>
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
                    {results.length}{' '}
                    {results.length === 1 ? 'matching salon' : 'matching salons'}
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </div>
        </CardContent>
      </Card>

      {/* Featured Salons */}
      {featuredSalons.length > 0 && !searchTerm && (
        <div>
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Featured Salons
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredSalons.map((salon) => (
              <SalonCard key={salon.id} salon={salon} variant="featured" />
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div>
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Search Results ({results.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {results.length === 0 && searchTerm && (
        <Card>
          <CardContent className="p-6">
            <Empty>
              <EmptyMedia variant="icon">
                <Search className="h-6 w-6" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No salons found</EmptyTitle>
                <EmptyDescription>No salons match your filters right now.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                Try searching a nearby city or lowering your rating threshold.
              </EmptyContent>
            </Empty>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
