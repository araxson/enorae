'use client'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function NotesField() {
  return (
    <div className="flex flex-col gap-3">
    <Label htmlFor="notes">Notes (optional)</Label>
    <Textarea
      id="notes"
      name="notes"
      placeholder="Additional details about this movement..."
      rows={3}
    />
    </div>
  )
}
