'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Stack } from '@/components/layout'
import { Search, MapPin, Star, Shield, Sparkles, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import type { SalonSearchResult } from '../api/queries'

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
  const [suggestions, setSuggestions] = useState<{ name: string; slug: string }[]>([])
  const [results, setResults] = useState<SalonSearchResult[]>(initialResults)
  const [isSearching, setIsSearching] = useState(false)

  // Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length < 2) {
        setSuggestions([])
        return
      }

      const response = await fetch(
        `/api/salons/suggestions?q=${encodeURIComponent(searchTerm)}`
      )
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

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

  const formatRating = (rating: number) => rating.toFixed(1)

  const formatAddress = (address: { city?: string | null; state?: string | null } | null | undefined) => {
    const parts = []
    if (address?.city) parts.push(address.city)
    if (address?.state) parts.push(address.state)
    return parts.join(', ') || 'Location not available'
  }

  return (
    <Stack gap="xl">
      {/* Search Bar with Advanced Filters */}
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
          <Stack gap="md">
            {/* Search Term with Suggestions */}
            <div className="relative">
              <Input
                placeholder="Search by salon name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10">
                  {suggestions.map((suggestion) => (
                    <Link
                      key={suggestion.slug}
                      href={`/customer/salons/${suggestion.slug}`}
                      className="block px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      {suggestion.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Filters Grid */}
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
                    onCheckedChange={(checked) => setVerifiedOnly(!!checked)}
                  />
                  <Label htmlFor="verified" className="text-sm cursor-pointer">
                    Verified only
                  </Label>
                </div>
              </div>
            </div>

            <Button onClick={handleSearch} className="w-full" disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Search Salons'}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Featured Salons */}
      {featuredSalons.length > 0 && !searchTerm && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Featured Salons
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredSalons.map((salon) => (
              <Link key={salon.id} href={`/customer/salons/${salon.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle>{salon.name}</CardTitle>
                      {salon.is_verified && <Shield className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <CardDescription>{formatAddress(salon.address)}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{formatRating(salon.rating_average)}</span>
                      <Badge variant="secondary" className="ml-auto">Featured</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Search Results ({results.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((salon) => (
              <Link key={salon.id} href={`/customer/salons/${salon.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle>{salon.name}</CardTitle>
                      <div className="flex gap-1">
                        {salon.is_verified && <Shield className="h-4 w-4 text-blue-600" />}
                        {salon.is_featured && <Sparkles className="h-4 w-4 text-yellow-500" />}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <CardDescription>{formatAddress(salon.address)}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{formatRating(salon.rating_average)}</span>
                      {salon.similarity_score && (
                        <Badge variant="outline" className="ml-auto">
                          {Math.round(salon.similarity_score * 100)}% match
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {results.length === 0 && searchTerm && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No salons found matching your criteria. Try adjusting your filters.
            </p>
          </CardContent>
        </Card>
      )}
    </Stack>
  )
}
