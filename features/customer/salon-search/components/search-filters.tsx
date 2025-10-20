'use client'

import { useId } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Search } from 'lucide-react'

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
  const searchInputId = useId()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          <CardTitle>Advanced Salon Search</CardTitle>
        </div>
        <CardDescription>
          Find the perfect salon with advanced filters and fuzzy matching
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Label htmlFor={searchInputId} className="sr-only">
              Search by salon name
            </Label>
            <Input
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
              className="pr-10"
            />
            <Search
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />

            {suggestions.length > 0 && (
              <div
                id={suggestionsListId}
                role="listbox"
                aria-label="Salon suggestions"
                className="absolute left-0 right-0 top-full z-10 mt-1 rounded-md border bg-background shadow-lg"
              >
                {suggestions.map((suggestion, index) => {
                  const optionId = `${suggestionsListId}-option-${index}`
                  const isFocused = focusedIndex === index
                  return (
                    <Link
                      key={suggestion.slug}
                      id={optionId}
                      role="option"
                      aria-selected={isFocused}
                      tabIndex={-1}
                      onMouseEnter={() => setFocusedIndex(index)}
                      href={`/customer/salons/${suggestion.slug}`}
                      className={`block px-4 py-2 text-sm ${
                        isFocused ? 'bg-muted text-foreground' : 'hover:bg-muted/80'
                      }`}
                    >
                      {suggestion.name}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label>City</Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger>
                  <SelectValue placeholder="All cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All cities</SelectItem>
                  {popularCities.map((c) => (
                    <SelectItem key={c.city} value={c.city}>
                      {c.city} ({c.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>State</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger>
                  <SelectValue placeholder="All states" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All states</SelectItem>
                  {availableStates.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Minimum Rating</Label>
              <Select value={minRating} onValueChange={setMinRating}>
                <SelectTrigger>
                  <SelectValue placeholder="Any rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any rating</SelectItem>
                  <SelectItem value="4.5">4.5+ stars</SelectItem>
                  <SelectItem value="4.0">4.0+ stars</SelectItem>
                  <SelectItem value="3.5">3.5+ stars</SelectItem>
                  <SelectItem value="3.0">3.0+ stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verified"
                  checked={verifiedOnly}
                  onCheckedChange={(checked) => setVerifiedOnly(Boolean(checked))}
                />
                <Label htmlFor="verified" className="cursor-pointer text-sm">
                  Verified only
                </Label>
              </div>
            </div>
          </div>

          <Button variant="default" onClick={handleSearch} className="w-full" disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Search Salons'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
