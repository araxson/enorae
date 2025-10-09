'use client'

import { Grid, Stack } from '@/components/layout'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function QuantityFields() {
  return (
    <Grid cols={{ base: 1, md: 2 }} gap="lg">
      <Stack gap="sm">
        <Label htmlFor="quantity">Quantity</Label>
        <Input type="number" id="quantity" name="quantity" required min="1" placeholder="e.g., 10" />
      </Stack>

      <Stack gap="sm">
        <Label htmlFor="costPrice">Cost Price (optional)</Label>
        <Input
          type="number"
          id="costPrice"
          name="costPrice"
          min="0"
          step="0.01"
          placeholder="e.g., 25.50"
        />
      </Stack>
    </Grid>
  )
}
