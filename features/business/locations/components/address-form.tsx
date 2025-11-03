'use client'

import { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Form } from '@/components/ui/form'
import { AdditionalInfoSection, CoordinatesSection, LocationDetailsSection, MapIntegrationSection, StreetAddressSection } from './address-form/sections'
import { AddressValidation } from './address-validation'
import type { LocationAddress } from '../api/types'
import { updateLocationAddress, type AddressInput } from '@/features/business/locations/api/mutations'
import { ButtonGroup } from '@/components/ui/button-group'
import { addressSchema, type AddressSchema } from '../api/schema'

type Props = {
  locationId: string
  address: LocationAddress | null
  onSuccess?: () => void
}

export function AddressForm({ locationId, address, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const defaultValues = useMemo(() => ({
    street_address: address?.street_address || '',
    address_line_2: address?.street_address_2 || '',
    city: address?.city || '',
    state: address?.state_province || '',
    postal_code: address?.postal_code || '',
    country: address?.country_code || 'US',
    latitude: address?.latitude || undefined,
    longitude: address?.longitude || undefined,
  }), [address])

  const form = useForm<AddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues,
    mode: 'onSubmit',
  })

  const handleSubmit = useCallback(async (data: AddressSchema) => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    const input: AddressInput = {
      street_address: data.street_address,
      street_address_2: data.address_line_2 || null,
      city: data.city,
      state_province: data.state,
      postal_code: data.postal_code,
      country_code: data.country,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      formatted_address: null,
      place_id: null,
      neighborhood: null,
      landmark: null,
      parking_instructions: null,
      accessibility_notes: null,
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
  }, [locationId, onSuccess])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
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

          <StreetAddressSection form={form} />
          <LocationDetailsSection form={form} />
          <MapIntegrationSection address={address} />
          <CoordinatesSection form={form} />
          <AdditionalInfoSection address={address} />
          <AddressValidation address={address} />

          <ButtonGroup aria-label="Form actions">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner className="size-4" />
                  <span>Saving…</span>
                </>
              ) : (
                <span>Save Address</span>
              )}
            </Button>
          </ButtonGroup>
        </div>
      </form>
    </Form>
  )
}
