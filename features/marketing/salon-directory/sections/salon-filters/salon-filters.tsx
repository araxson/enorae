'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { Search, X, MapPin, Filter } from 'lucide-react'
import { Kbd } from '@/components/ui/kbd'

interface SalonFiltersProps {
  cities?: { city: string; state: string; count: number }[]
  categories?: string[]
}

export function SalonFilters({ cities = [], categories = [] }: SalonFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '')
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')

  const handleSearch = () => {
    const params = new URLSearchParams()

    if (searchTerm) params.set('search', searchTerm)
    if (selectedCity) params.set('city', selectedCity)
    if (selectedState) params.set('state', selectedState)
    if (selectedCategory) params.set('category', selectedCategory)

    const queryString = params.toString()
    router.push(queryString ? `/salons?${queryString}` : '/salons')
  }

  const handleClear = () => {
    setSearchTerm('')
    setSelectedCity('')
    setSelectedState('')
    setSelectedCategory('')
    router.push('/salons')
  }

  const hasActiveFilters = searchTerm || selectedCity || selectedState || selectedCategory

  return (
    <Item variant="outline" className="flex flex-col gap-6">
      <ItemHeader className="flex flex-col gap-2">
        <ItemTitle>
          <h2 className="text-lg font-semibold tracking-tight">Filter salons</h2>
        </ItemTitle>
        <ItemDescription>
          Refine results by search term, location, and category.
        </ItemDescription>
      </ItemHeader>
      <ItemContent>
        <FieldSet>
          <Field>
            <FieldLabel>Search salons</FieldLabel>
            <FieldContent>
              <InputGroup>
                <InputGroupAddon>
                  <Search className="size-4" aria-hidden="true" />
                </InputGroupAddon>
                <InputGroupInput
                  type="search"
                  placeholder="Search salons by name, description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  aria-label="Search salons"
                  autoComplete="off"
                />
                {searchTerm ? (
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => setSearchTerm('')}
                      aria-label="Clear search"
                    >
                      <X className="size-4" aria-hidden="true" />
                    </InputGroupButton>
                  </InputGroupAddon>
                ) : null}
              </InputGroup>
            </FieldContent>
          </Field>

          {cities.length > 0 || categories.length > 0 ? (
            <FieldLegend variant="legend">Filter by</FieldLegend>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            {cities.length > 0 && (
              <Field orientation="responsive" className="w-full sm:w-auto">
                <FieldLabel>City</FieldLabel>
                <FieldContent>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="w-52">
                      <MapPin className="mr-2 size-4" aria-hidden="true" />
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">All cities</SelectItem>
                      {cities.map(({ city, state, count }) => (
                        <SelectItem key={`${city}-${state}`} value={city}>
                          {city}, {state} ({count})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>
            )}

            {categories.length > 0 && (
              <Field orientation="responsive" className="w-full sm:w-auto">
                <FieldLabel>Category</FieldLabel>
                <FieldContent>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-52">
                      <Filter className="mr-2 size-4" aria-hidden="true" />
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">All categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>
            )}
          </div>
          <Item variant="muted">
            <ItemContent>
              <ItemDescription>
                Press <Kbd>Enter</Kbd> inside the search field to apply filters instantly.
              </ItemDescription>
            </ItemContent>
          </Item>
        </FieldSet>
      </ItemContent>
      <ItemFooter>
        <div className="flex flex-wrap items-center justify-end gap-3">
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={handleClear}>
              <X className="mr-2 size-4" aria-hidden="true" />
              Clear
            </Button>
          )}
          <Button size="sm" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </ItemFooter>
    </Item>
  )
}
