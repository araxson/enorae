'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { SalonSearchResult } from '@/features/customer/salon-search/api/queries'
import { useSearchSuggestions } from '../hooks/use-search-suggestions'
import { SearchBarSection } from './search-bar-section'
import { FeaturedSalonsSection } from './featured-salons-section'
import { SearchResultsSection } from './search-results-section'

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

  return (
    <div className="flex flex-col gap-8">
      <SearchBarSection
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
        isSearching={isSearching}
        suggestionsOpen={suggestionsOpen}
        setSuggestionsOpen={setSuggestionsOpen}
        suggestions={suggestions}
        resultsCount={results.length}
        popularCities={popularCities}
        availableStates={availableStates}
        handleSearch={handleSearch}
        handleSuggestionSelect={handleSuggestionSelect}
      />

      <FeaturedSalonsSection featuredSalons={featuredSalons} searchTerm={searchTerm} />

      <SearchResultsSection results={results} searchTerm={searchTerm} />
    </div>
  )
}
