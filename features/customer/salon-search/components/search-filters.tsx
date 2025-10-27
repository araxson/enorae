'use client'

import { useId } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'

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
  const router = useRouter()

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

          <FieldSet>
            <FieldLegend className="sr-only">Search filters</FieldLegend>
            <FieldGroup className="gap-4 md:grid md:grid-cols-2 lg:grid-cols-4">
              <Field>
                <FieldLabel htmlFor="city-filter">City</FieldLabel>
                <FieldContent>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger id="city-filter">
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
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="state-filter">State</FieldLabel>
                <FieldContent>
                  <Select value={state} onValueChange={setState}>
                    <SelectTrigger id="state-filter">
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
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="rating-filter">Minimum rating</FieldLabel>
                <FieldContent>
                  <Select value={minRating} onValueChange={setMinRating}>
                    <SelectTrigger id="rating-filter">
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
                </FieldContent>
              </Field>

              <Field orientation="responsive">
                <FieldLabel htmlFor="verified">Verification</FieldLabel>
                <FieldContent className="flex items-center gap-2">
                  <Checkbox
                    id="verified"
                    checked={verifiedOnly}
                    onCheckedChange={(checked) => setVerifiedOnly(Boolean(checked))}
                  />
                  <FieldDescription className="text-sm text-foreground">
                    Verified only
                  </FieldDescription>
                </FieldContent>
              </Field>
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
      </CardContent>
    </Card>
  )
}
