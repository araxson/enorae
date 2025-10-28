'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { MapPin, Globe, CheckCircle } from 'lucide-react'
import { bulkUpdateAddresses, geocodeAllAddresses } from '@/features/business/locations/api/mutations/bulk-address'
import { useToast } from '@/lib/hooks/use-toast'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemContent,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

type Props = {
  salonId: string
  locationIds: string[]
  selectedIds: string[]
}

export function BulkAddressActions({ salonId, locationIds, selectedIds }: Props) {
  const [countryCode, setCountryCode] = useState('US')
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const handleBulkCountryUpdate = async () => {
    if (selectedIds.length === 0) {
      toast({
        title: 'No locations selected',
        description: 'Please select at least one location',
        variant: 'destructive',
      })
      return
    }

    setIsUpdating(true)
    try {
      const result = await bulkUpdateAddresses(selectedIds, { country_code: countryCode })
      toast({
        title: 'Country updated',
        description: `Successfully updated ${result.updated} location(s)`,
      })
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'Failed to update locations',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleGeocodeAll = async () => {
    setIsUpdating(true)
    try {
      const result = await geocodeAllAddresses(salonId)
      toast({
        title: 'Geocoding complete',
        description: `Success: ${result.success}, Failed: ${result.failed}`,
        variant: result.failed > 0 ? 'destructive' : 'default',
      })
    } catch (error) {
      toast({
        title: 'Geocoding failed',
        description: error instanceof Error ? error.message : 'Failed to geocode addresses',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Item variant="outline" className="flex-col gap-6">
      <ItemHeader>
        <ItemTitle>Bulk Address Actions</ItemTitle>
      </ItemHeader>
      <ItemContent>
        <FieldSet className="flex flex-col gap-6">
          <Alert>
            <CheckCircle className="size-4" />
            <AlertTitle>Selection status</AlertTitle>
            <AlertDescription>
              {selectedIds.length > 0
                ? `${selectedIds.length} location(s) selected`
                : 'Select locations to perform bulk actions'}
            </AlertDescription>
          </Alert>

          <Field>
            <FieldLabel>Update Country for Selected Locations</FieldLabel>
            <FieldContent className="flex items-center gap-3">
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="GB">United Kingdom</SelectItem>
                  <SelectItem value="AU">Australia</SelectItem>
                  <SelectItem value="NZ">New Zealand</SelectItem>
                </SelectContent>
              </Select>
              <ButtonGroup aria-label="Update country">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBulkCountryUpdate}
                  disabled={isUpdating || selectedIds.length === 0}
                  className="gap-2"
                >
                  {isUpdating ? <Spinner /> : <Globe className="size-4" />}
                  Update
                </Button>
              </ButtonGroup>
            </FieldContent>
            <FieldDescription>Applies the selected country to every chosen location.</FieldDescription>
          </Field>

          <Field>
            <FieldLabel>Geocode Missing Coordinates</FieldLabel>
            <FieldContent>
              <ButtonGroup aria-label="Geocode addresses">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGeocodeAll}
                  disabled={isUpdating}
                  className="flex w-full items-center gap-2"
                >
                  {isUpdating ? <Spinner /> : <MapPin className="size-4" />}
                  {isUpdating ? 'Processing...' : 'Geocode All Addresses Without Coordinates'}
                </Button>
              </ButtonGroup>
            </FieldContent>
          </Field>
        </FieldSet>
      </ItemContent>
    </Item>
  )
}
