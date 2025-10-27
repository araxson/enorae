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
import { Search, X, MapPin, Filter } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

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
    <Card>
      <CardHeader>
        <CardTitle>Filter salons</CardTitle>
        <CardDescription>
          Refine results by search term, location, and category.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <InputGroup>
          <InputGroupAddon>
            <Search className="size-4" aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search salons by name, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
        <div className="flex flex-wrap items-center gap-3">
          {cities.length > 0 && (
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-52">
                <MapPin className="mr-2 h-4 w-4" />
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
          )}

          {categories.length > 0 && (
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-52">
                <Filter className="mr-2 h-4 w-4" />
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
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-end gap-3">
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={handleClear}>
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
        <Button size="sm" onClick={handleSearch}>
          Search
        </Button>
      </CardFooter>
    </Card>
  )
}
