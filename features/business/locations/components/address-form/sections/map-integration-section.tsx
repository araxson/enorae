'use client'

import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { MapPin, Search, Check } from 'lucide-react'
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

  // Geocode address to get coordinates
  const geocodeAddress = useCallback(async (fullAddress: string) => {
    setIsSearching(true)
    try {
      // Using Google Maps Geocoding API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${process.env['NEXT_PUBLIC_GOOGLE_MAPS_API_KEY']}`
      )
      const data = await response.json()

      if (data.results && data.results.length > 0) {
        const result = data.results[0]
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
      console.error('Geocoding error:', error)
    } finally {
      setIsSearching(false)
    }
  }, [onAddressSelect])

  // Search for address suggestions
  const searchAddress = useCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${process.env['NEXT_PUBLIC_GOOGLE_MAPS_API_KEY']}`
      )
      const data = await response.json()

      if (data.predictions) {
        setSuggestions(data.predictions.slice(0, 5))
      }
    } catch (error) {
      console.error('Address search error:', error)
    } finally {
      setIsSearching(false)
    }
  }, [])

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

          <div className="flex flex-col gap-3">
            <Label htmlFor="address-search">Search Address</Label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  id="address-search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    searchAddress(e.target.value)
                  }}
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
                disabled={isSearching || !address?.['street_address']}
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

          {address?.['latitude'] && address?.['longitude'] && (
            <div className="border rounded-md overflow-hidden">
              <iframe
                width="100%"
                height="300"
                className="w-full border-0"
                loading="lazy"
                src={`https://maps.google.com/maps?q=${address['latitude']},${address['longitude']}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                title="Location Map"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
