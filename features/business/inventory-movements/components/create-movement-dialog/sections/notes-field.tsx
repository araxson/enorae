'use client'

import { Stack } from '@/components/layout'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function NotesField() {
  return (
    <Stack gap="sm">
    <Label htmlFor="notes">Notes (optional)</Label>
    <Textarea
      id="notes"
      name="notes"
      placeholder="Additional details about this movement..."
      rows={3}
    />
    </Stack>
  )
}
