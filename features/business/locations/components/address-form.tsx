'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AdditionalInfoSection, CoordinatesSection, LocationDetailsSection, MapIntegrationSection, StreetAddressSection } from './address-form/sections'
import { AddressValidation } from './address-validation'
import type { LocationAddress } from './address-form/types'
import { updateLocationAddress, type AddressInput } from '@/features/business/locations/api/address.mutations'
import { ButtonGroup } from '@/components/ui/button-group'

type Props = {
  locationId: string
  address: LocationAddress | null
  onSuccess?: () => void
}

export function AddressForm({ locationId, address, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(event.currentTarget)

    const input: AddressInput = {
      street_address: formData.get('street_address') as string,
      street_address_2: (formData.get('street_address_2') as string) || null,
      city: formData.get('city') as string,
      state_province: formData.get('state_province') as string,
      postal_code: formData.get('postal_code') as string,
      country_code: (formData.get('country_code') as string) || 'US',
      latitude: formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : null,
      longitude: formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : null,
      formatted_address: (formData.get('formatted_address') as string) || null,
      place_id: (formData.get('place_id') as string) || null,
      neighborhood: (formData.get('neighborhood') as string) || null,
      landmark: (formData.get('landmark') as string) || null,
      parking_instructions: (formData.get('parking_instructions') as string) || null,
      accessibility_notes: (formData.get('accessibility_notes') as string) || null,
    }

    const result = await updateLocationAddress(locationId, input)

    if (result.success) {
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onSuccess?.()
      }, 2000)
    } else {
      setError(result.error)
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Update failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertTitle>Address updated</AlertTitle>
            <AlertDescription>Address updated successfully!</AlertDescription>
          </Alert>
        )}

        <StreetAddressSection address={address} />
        <LocationDetailsSection address={address} />
        <MapIntegrationSection address={address} />
        <CoordinatesSection address={address} />
        <AdditionalInfoSection address={address} />
        <AddressValidation address={address} />

        <ButtonGroup className="justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Address'}
          </Button>
        </ButtonGroup>
      </div>
    </form>
  )
}
