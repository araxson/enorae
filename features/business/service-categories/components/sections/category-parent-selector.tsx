'use client'

import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ServiceCategoryWithCounts } from '@/features/business/service-categories/api/queries'

type CategoryParentSelectorProps = {
  availableParents: ServiceCategoryWithCounts[]
  defaultValue?: string | null
  parentError?: string
  isPending?: boolean
}

export function CategoryParentSelector({
  availableParents,
  defaultValue,
  parentError,
  isPending,
}: CategoryParentSelectorProps) {
  return (
    <Field>
      <FieldLabel htmlFor="parentId">Parent Category (Optional)</FieldLabel>
      <Select name="parentId" defaultValue={defaultValue || undefined} disabled={isPending}>
        <SelectTrigger
          id="parentId"
          aria-invalid={!!parentError}
          aria-describedby={
            parentError ? 'parentId-error parentId-hint' : 'parentId-hint'
          }
        >
          <SelectValue placeholder="None (Top Level)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">None (Top Level)</SelectItem>
          {availableParents.map((parent) => (
            <SelectItem key={parent.id} value={parent.id || ''}>
              {parent.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldDescription id="parentId-hint">
        Organize this category under a parent category
      </FieldDescription>
      {parentError && (
        <p id="parentId-error" className="text-sm text-destructive mt-1" role="alert">
          {parentError}
        </p>
      )}
    </Field>
  )
}
