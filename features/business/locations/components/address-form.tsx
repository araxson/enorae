'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Stack, Grid, Flex } from '@/components/layout'
import { H3, Muted } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { Database } from '@/lib/types/database.types'
import { updateLocationAddress, type AddressInput } from '../api/address.mutations'

type LocationAddress = Database['organization']['Tables']['location_addresses']['Row']

interface AddressFormProps {
  locationId: string
  address: LocationAddress | null
  onSuccess?: () => void
}

export function AddressForm({ locationId, address, onSuccess }: AddressFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)

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
      <Stack gap="lg">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>Address updated successfully!</AlertDescription>
          </Alert>
        )}

        <Card className="p-6">
          <Stack gap="lg">
            <H3>Street Address</H3>
            <Separator />

            <Stack gap="sm">
              <Label htmlFor="street_address">
                Street Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="street_address"
                name="street_address"
                required
                defaultValue={address?.street_address || ''}
                placeholder="123 Main Street"
              />
            </Stack>

            <Stack gap="sm">
              <Label htmlFor="street_address_2">Apartment, Suite, etc.</Label>
              <Input
                id="street_address_2"
                name="street_address_2"
                defaultValue={address?.street_address_2 || ''}
                placeholder="Suite 100"
              />
            </Stack>

            <Grid cols={{ base: 1, md: 3 }} gap="lg">
              <Stack gap="sm">
                <Label htmlFor="city">
                  City <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="city"
                  name="city"
                  required
                  defaultValue={address?.city || ''}
                  placeholder="San Francisco"
                />
              </Stack>

              <Stack gap="sm">
                <Label htmlFor="state_province">
                  State/Province <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="state_province"
                  name="state_province"
                  required
                  defaultValue={address?.state_province || ''}
                  placeholder="CA"
                />
              </Stack>

              <Stack gap="sm">
                <Label htmlFor="postal_code">
                  Postal Code <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="postal_code"
                  name="postal_code"
                  required
                  defaultValue={address?.postal_code || ''}
                  placeholder="94102"
                />
              </Stack>
            </Grid>

            <Stack gap="sm">
              <Label htmlFor="country_code">Country Code</Label>
              <Input
                id="country_code"
                name="country_code"
                defaultValue={address?.country_code || 'US'}
                placeholder="US"
                maxLength={2}
              />
              <Muted>2-letter country code (e.g., US, CA, UK)</Muted>
            </Stack>
          </Stack>
        </Card>

        <Card className="p-6">
          <Stack gap="lg">
            <H3>Location Details</H3>
            <Separator />

            <Stack gap="sm">
              <Label htmlFor="neighborhood">Neighborhood</Label>
              <Input
                id="neighborhood"
                name="neighborhood"
                defaultValue={address?.neighborhood || ''}
                placeholder="Financial District"
              />
            </Stack>

            <Stack gap="sm">
              <Label htmlFor="landmark">Nearby Landmark</Label>
              <Input
                id="landmark"
                name="landmark"
                defaultValue={address?.landmark || ''}
                placeholder="Near City Hall"
              />
            </Stack>
          </Stack>
        </Card>

        <Card className="p-6">
          <Stack gap="lg">
            <H3>Coordinates (Optional)</H3>
            <Separator />

            <Grid cols={{ base: 1, md: 2 }} gap="lg">
              <Stack gap="sm">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  defaultValue={address?.latitude?.toString() || ''}
                  placeholder="37.7749"
                />
              </Stack>

              <Stack gap="sm">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  defaultValue={address?.longitude?.toString() || ''}
                  placeholder="-122.4194"
                />
              </Stack>
            </Grid>

            <Muted>Used for map display and location-based search</Muted>
          </Stack>
        </Card>

        <Card className="p-6">
          <Stack gap="lg">
            <H3>Additional Information</H3>
            <Separator />

            <Stack gap="sm">
              <Label htmlFor="parking_instructions">Parking Instructions</Label>
              <Textarea
                id="parking_instructions"
                name="parking_instructions"
                defaultValue={address?.parking_instructions || ''}
                placeholder="Street parking available. Parking garage entrance on Oak Street."
                rows={3}
              />
            </Stack>

            <Stack gap="sm">
              <Label htmlFor="accessibility_notes">Accessibility Notes</Label>
              <Textarea
                id="accessibility_notes"
                name="accessibility_notes"
                defaultValue={address?.accessibility_notes || ''}
                placeholder="Wheelchair accessible entrance on Main Street. Elevator available."
                rows={3}
              />
            </Stack>
          </Stack>
        </Card>

        <Flex justify="end" gap="sm">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Address'}
          </Button>
        </Flex>
      </Stack>
    </form>
  )
}
