'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Stack } from '@/components/layout'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import type { LocationAddress } from '../types'

type Props = {
  address: LocationAddress | null
}

export function AdditionalInfoSection({ address }: Props) {
  return (
    <Card>
      <CardContent>
        <Stack gap="lg">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Additional Information</h3>
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
      </CardContent>
    </Card>
  )
}
