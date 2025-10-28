'use client'

import { useCallback, useEffect, useId, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Search } from 'lucide-react'
import { EXTERNAL_APIS } from '@/lib/config/env'
import {
  GoogleMapsAutocompleteResponseSchema,
  GoogleMapsGeocodeResponseSchema,
} from '@/lib/config/google-maps-schema'
import type { LocationAddress } from '@/features/business/locations/components/address-form/types'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'

type AddressSearchFieldProps = {
  address: LocationAddress | null
  onAddressSelect?: (address: Partial<LocationAddress>) => void
}

export function AddressSearchField({ address, onAddressSelect }: AddressSearchFieldProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<Array<{
    description: string
    place_id: string
  }>>([])
  const suggestionListId = useId()

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

  const handleSuggestionClick = async (placeId: string, description: string) => {
    setSuggestions([])
    setSearchQuery(description)
    await geocodeAddress(description)
  }

  const handleManualGeocode = () => {
    if (address) {
      const fullAddress = `${address['street_address']}, ${address['city']}, ${address['state_province']} ${address['postal_code']}, ${address['country_code']}`
      geocodeAddress(fullAddress)
    }
  }

  return (
    <Field>
      <FieldLabel htmlFor="address-search">Search Address</FieldLabel>
      <FieldContent>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <InputGroup>
              <InputGroupAddon>
                <Search className="size-4" aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupInput
                id="address-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Start typing to search for an address..."
                aria-autocomplete="list"
                aria-controls={suggestions.length > 0 ? suggestionListId : undefined}
                aria-expanded={suggestions.length > 0}
                autoComplete="off"
              />
            </InputGroup>
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-10 mt-1">
                <Command aria-label="Address suggestions">
                  <CommandList id={suggestionListId}>
                    <CommandGroup heading="Suggested addresses">
                      {suggestions.map((suggestion) => (
                        <CommandItem
                          key={suggestion.place_id}
                          value={suggestion.place_id}
                          onSelect={() =>
                            handleSuggestionClick(
                              suggestion.place_id,
                              suggestion['description'],
                            )
                          }
                        >
                          {suggestion['description']}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleManualGeocode}
            disabled={isSearching || !address?.['street_address'] || !EXTERNAL_APIS.GOOGLE_MAPS.isEnabled()}
          >
            <Search className="mr-2 size-4" />
            Geocode
          </Button>
        </div>
      </FieldContent>
      <FieldDescription>Search for your address to automatically fill coordinates.</FieldDescription>
    </Field>
  )
}
