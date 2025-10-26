'use client'

import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { MapPin, Search, Check, AlertCircle } from 'lucide-react'
import { EXTERNAL_APIS } from '@/lib/config/env'
import {
  GoogleMapsAutocompleteResponseSchema,
  GoogleMapsGeocodeResponseSchema,
} from '@/lib/config/google-maps-schema'
import type { LocationAddress } from '@/features/business/locations/components/address-form/types'

type Props = {
  address: LocationAddress | null
  onAddressSelect?: (address: Partial<LocationAddress>) => void
}

export function MapIntegrationSection({ address, onAddressSelect }: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<Array<{
    description: string
    place_id: string
  }>>([])
  const [selectedAddress, setSelectedAddress] = useState<Partial<LocationAddress> | null>(null)

  // ASYNC FIX: Debounce address search with proper cleanup
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

        // API_INTEGRATION_FIX: Validate Google Maps API response
        const validationResult = GoogleMapsAutocompleteResponseSchema.safeParse(rawData)
        if (!validationResult.success) {
          console.error('[MapIntegration] Invalid autocomplete response:', validationResult.error)
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
        console.error('[MapIntegration] Address search error:', error)
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

  // Geocode address to get coordinates
  const geocodeAddress = useCallback(async (fullAddress: string) => {
    if (!EXTERNAL_APIS.GOOGLE_MAPS.isEnabled()) {
      console.error('[MapIntegration] Google Maps API not configured')
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

      // API_INTEGRATION_FIX: Validate Google Maps API response
      const validationResult = GoogleMapsGeocodeResponseSchema.safeParse(rawData)
      if (!validationResult.success) {
        console.error('[MapIntegration] Invalid geocode response:', validationResult.error)
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

        setSelectedAddress(addressData)
        onAddressSelect?.(addressData)
      }
    } catch (error) {
      console.error('[MapIntegration] Geocoding error:', error)
      setSelectedAddress(null)
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Map & Coordinates</CardTitle>
        <MapPin className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <Separator />

          {!EXTERNAL_APIS.GOOGLE_MAPS.isEnabled() && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Google Maps Not Configured</AlertTitle>
              <AlertDescription>
                Address autocomplete and geocoding are unavailable. Please configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-3">
            <Label htmlFor="address-search">Search Address</Label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  id="address-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Start typing to search for an address..."
                />
                {suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.place_id}
                        type="button"
                        className="w-full text-left px-4 py-2 hover:bg-muted transition-colors text-sm"
                        onClick={() => handleSuggestionClick(suggestion.place_id, suggestion['description'])}
                      >
                        {suggestion['description']}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleManualGeocode}
                disabled={isSearching || !address?.['street_address'] || !EXTERNAL_APIS.GOOGLE_MAPS.isEnabled()}
              >
                <Search className="h-4 w-4 mr-2" />
                Geocode
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Search for your address to automatically fill coordinates</p>
          </div>

          {selectedAddress && (
            <Alert>
              <Check className="h-4 w-4" />
              <AlertTitle>Address located</AlertTitle>
              <AlertDescription>
                {selectedAddress['formatted_address']}
                <br />
                Coordinates: {selectedAddress['latitude']}, {selectedAddress['longitude']}
              </AlertDescription>
            </Alert>
          )}

          {address?.['latitude'] && address?.['longitude'] && EXTERNAL_APIS.GOOGLE_MAPS.isEnabled() && (
            <div className="border rounded-md overflow-hidden">
              <iframe
                width="100%"
                height="300"
                className="w-full border-0"
                loading="lazy"
                src={`${EXTERNAL_APIS.GOOGLE_MAPS.EMBED_URL}?q=${address['latitude']},${address['longitude']}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                title="Location Map"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
