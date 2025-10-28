'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import type { ServiceCategoryWithCounts } from '@/features/business/service-categories/api/queries'

interface CategoryFormFieldsProps {
  category?: ServiceCategoryWithCounts | null
  availableParents: ServiceCategoryWithCounts[]
  parentId: string
  onParentIdChange: (value: string) => void
}

export function CategoryFormFields({
  category,
  availableParents,
  parentId,
  onParentIdChange,
}: CategoryFormFieldsProps) {
  return (
    <FieldSet>
      <FieldGroup className="grid gap-4 py-4">
        {category ? <input type="hidden" name="id" value={category['id'] || ''} /> : null}

        <Field>
          <FieldLabel htmlFor="name">Name *</FieldLabel>
          <FieldContent>
            <Input
              id="name"
              name="name"
              defaultValue={category?.['name'] || ''}
              required
              maxLength={100}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="parentId">Parent Category</FieldLabel>
          <FieldContent>
            <Select value={parentId || 'none'} onValueChange={(v) => onParentIdChange(v === 'none' ? '' : v)}>
              <SelectTrigger id="parentId">
                <SelectValue placeholder="None (Top Level)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (Top Level)</SelectItem>
                {availableParents.map((cat) => (
                  <SelectItem key={cat['id']} value={cat['id'] || ''}>
                    {cat['parent_id'] ? `↳ ${cat['name']}` : cat['name']}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>
              Optional: Create a subcategory under an existing category
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
