'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { MapPin, Globe, CheckCircle } from 'lucide-react'
import { bulkUpdateAddresses, geocodeAllAddresses } from '@/features/business/locations/api/bulk-address.mutations'
import { useToast } from '@/lib/hooks/use-toast'

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
    <Card>
      <CardHeader>
        <CardTitle>Bulk Address Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <Alert>
            <AlertDescription>
              {selectedIds.length > 0 ? (
                <>
                  <CheckCircle className="h-4 w-4 inline mr-2" />
                  {selectedIds.length} location(s) selected
                </>
              ) : (
                'Select locations to perform bulk actions'
              )}
            </AlertDescription>
          </Alert>

          <div className="flex flex-col gap-3">
            <Label>Update Country for Selected Locations</Label>
            <div className="flex gap-3">
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
              <Button
                type="button"
                variant="outline"
                onClick={handleBulkCountryUpdate}
                disabled={isUpdating || selectedIds.length === 0}
              >
                <Globe className="h-4 w-4 mr-2" />
                Update
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Label>Geocode Missing Coordinates</Label>
            <Button
              type="button"
              variant="outline"
              onClick={handleGeocodeAll}
              disabled={isUpdating}
              className="w-full"
            >
              <MapPin className="h-4 w-4 mr-2" />
              {isUpdating ? 'Processing...' : 'Geocode All Addresses Without Coordinates'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
