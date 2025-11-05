'use client'

import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

interface PrimaryLocationFieldProps {
  isPrimary: boolean
  onIsPrimaryChange: (checked: boolean) => void
  isPending: boolean
  errors?: string[]
}

export function PrimaryLocationField({
  isPrimary,
  onIsPrimaryChange,
  isPending,
  errors,
}: PrimaryLocationFieldProps) {
  return (
    <div>
      <Label htmlFor="isPrimary">Primary Location</Label>
      <div className="flex items-center gap-2 mt-2">
        <Checkbox
          id="isPrimary"
          checked={isPrimary}
          onCheckedChange={(checked) => onIsPrimaryChange(checked as boolean)}
          disabled={isPending}
          aria-describedby="isPrimary-hint"
        />
        <p id="isPrimary-hint" className="text-sm text-muted-foreground">
          Mark as the default location for the business
        </p>
      </div>
      {errors && (
        <p className="text-sm text-destructive mt-1" role="alert">
          {errors[0]}
        </p>
      )}
    </div>
  )
}
