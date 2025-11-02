'use client'

import { useCallback, useEffect, useState } from 'react'
import { EXTERNAL_APIS } from '@/lib/config/env'
import {
  GoogleMapsAutocompleteResponseSchema,
  GoogleMapsGeocodeResponseSchema,
} from '@/lib/config/google-maps-schema'
import type { LocationAddress } from '@/features/business/locations/types'

interface AddressSuggestion {
  description: string
  place_id: string
}

export function useAddressSearch(onAddressSelect?: (address: Partial<LocationAddress>) => void) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])

  // Debounce address search with proper cleanup
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 3) {
      setSuggestions([])
      return
    }

    if (!EXTERNAL_APIS.GOOGLE_MAPS.isEnabled()) {
      return
    }

    const controller = new AbortController()
    const debounceTimer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const apiKey = EXTERNAL_APIS.GOOGLE_MAPS.getApiKey()
        const url = `${EXTERNAL_APIS.GOOGLE_MAPS.AUTOCOMPLETE_URL}?input=${encodeURIComponent(searchQuery)}&key=${apiKey}`

        const response = await fetch(url, { signal: controller.signal })

        if (!response.ok) {
          throw new Error(`Autocomplete request failed: ${response.status}`)
        }

        const rawData = await response.json()

        const validationResult = GoogleMapsAutocompleteResponseSchema.safeParse(rawData)
        if (!validationResult.success) {
          console.error('[AddressSearch] Invalid autocomplete response:', validationResult.error)
          throw new Error('Invalid autocomplete response format')
        }

        const data = validationResult.data
        if (data.predictions) {
          setSuggestions(data.predictions.slice(0, 5))
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return
        }
        console.error('[AddressSearch] Address search error:', error)
        setSuggestions([])
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => {
      clearTimeout(debounceTimer)
      controller.abort()
    }
  }, [searchQuery])

  const geocodeAddress = useCallback(async (fullAddress: string) => {
    if (!EXTERNAL_APIS.GOOGLE_MAPS.isEnabled()) {
      console.error('[AddressSearch] Google Maps API not configured')
      return
    }

    setIsSearching(true)
    try {
      const apiKey = EXTERNAL_APIS.GOOGLE_MAPS.getApiKey()
      const url = `${EXTERNAL_APIS.GOOGLE_MAPS.GEOCODE_URL}?address=${encodeURIComponent(fullAddress)}&key=${apiKey}`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Geocoding request failed: ${response.status}`)
      }

      const rawData = await response.json()

      const validationResult = GoogleMapsGeocodeResponseSchema.safeParse(rawData)
      if (!validationResult.success) {
        console.error('[AddressSearch] Invalid geocode response:', validationResult.error)
        throw new Error('Invalid geocode response format')
      }

      const data = validationResult.data
      if (data.results && data.results.length > 0) {
        const result = data.results[0]
        if (!result) {
          throw new Error('No geocode result found')
        }
        const location = result.geometry.location

        const addressData: Partial<LocationAddress> = {
          latitude: location.lat,
          longitude: location.lng,
          formatted_address: result['formatted_address'],
          place_id: result.place_id,
        }

        onAddressSelect?.(addressData)
      }
    } catch (error) {
      console.error('[AddressSearch] Geocoding error:', error)
    } finally {
      setIsSearching(false)
    }
  }, [onAddressSelect])

  return {
    searchQuery,
    setSearchQuery,
    isSearching,
    suggestions,
    setSuggestions,
    geocodeAddress,
  }
}
