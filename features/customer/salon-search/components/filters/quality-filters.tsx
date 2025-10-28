'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'

interface QualityFiltersProps {
  verifiedOnly: boolean
  setVerifiedOnly: (value: boolean) => void
  minRating: string
  setMinRating: (value: string) => void
}

export function QualityFilters({
  verifiedOnly,
  setVerifiedOnly,
  minRating,
  setMinRating,
}: QualityFiltersProps) {
  return (
    <>
      <Field>
        <FieldLabel htmlFor="rating-filter">Minimum rating</FieldLabel>
        <FieldContent>
          <Select value={minRating} onValueChange={setMinRating}>
            <SelectTrigger id="rating-filter">
              <SelectValue placeholder="Any rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any rating</SelectItem>
              <SelectItem value="4.5">4.5+ stars</SelectItem>
              <SelectItem value="4.0">4.0+ stars</SelectItem>
              <SelectItem value="3.5">3.5+ stars</SelectItem>
              <SelectItem value="3.0">3.0+ stars</SelectItem>
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>

      <Field orientation="responsive">
        <FieldLabel htmlFor="verified">Verification</FieldLabel>
        <FieldContent className="flex items-center gap-2">
          <Checkbox
            id="verified"
            checked={verifiedOnly}
            onCheckedChange={(checked) => setVerifiedOnly(Boolean(checked))}
          />
          <FieldDescription className="text-sm text-foreground">Verified only</FieldDescription>
        </FieldContent>
      </Field>
    </>
  )
}
