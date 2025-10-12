'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Stack, Group } from '@/components/layout'
import { Search, X, MapPin, Filter } from 'lucide-react'
import { Card } from '@/components/ui/card'

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
    <Card className="p-6">
      <Stack gap="md">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search salons by name, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>

        {/* Filter Row */}
        <Group gap="sm" className="flex-wrap">
          {/* City Filter */}
          {cities.length > 0 && (
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-[200px]">
                <MapPin className="h-4 w-4 mr-2" />
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

          {/* Category Filter */}
          {categories.length > 0 && (
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
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

          {/* Action Buttons */}
          <Group gap="sm" className="ml-auto">
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={handleClear}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
            <Button size="sm" onClick={handleSearch}>
              Search
            </Button>
          </Group>
        </Group>
      </Stack>
    </Card>
  )
}
