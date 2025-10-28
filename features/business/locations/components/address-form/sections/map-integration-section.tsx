'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { MapPin, Check, AlertCircle } from 'lucide-react'
import { EXTERNAL_APIS } from '@/lib/config/env'
import type { LocationAddress } from '@/features/business/locations/components/address-form/types'
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { AddressSearchField } from './address-search-field'
import { MapDisplay } from './map-display'

type Props = {
  address: LocationAddress | null
  onAddressSelect?: (address: Partial<LocationAddress>) => void
}

export function MapIntegrationSection({ address, onAddressSelect }: Props) {
  const [selectedAddress, setSelectedAddress] = useState<Partial<LocationAddress> | null>(null)

  const handleAddressSelect = (addressData: Partial<LocationAddress>) => {
    setSelectedAddress(addressData)
    onAddressSelect?.(addressData)
  }

  return (
    <Card>
      <CardHeader>
        <ItemGroup className="flex items-center justify-between">
          <Item>
            <ItemContent>
              <ItemTitle>Map &amp; Coordinates</ItemTitle>
            </ItemContent>
            <ItemMedia variant="icon">
              <MapPin className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            </ItemMedia>
          </Item>
        </ItemGroup>
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

          <AddressSearchField address={address} onAddressSelect={handleAddressSelect} />

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

          <MapDisplay address={address} />
        </div>
      </CardContent>
    </Card>
  )
}
