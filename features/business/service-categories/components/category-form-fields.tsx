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
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import type { UseFormReturn } from 'react-hook-form'
import type { CategorySchema } from '@/features/business/service-categories/api/schema'
import type { ServiceCategoryWithCounts } from '@/features/business/service-categories/api/queries'

interface CategoryFormFieldsProps {
  form: UseFormReturn<CategorySchema>
  availableParents: ServiceCategoryWithCounts[]
}

export function CategoryFormFields({
  form,
  availableParents,
}: CategoryFormFieldsProps) {
  return (
    <FieldSet>
      <FieldGroup className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <Field>
                <FieldLabel htmlFor="name">Name *</FieldLabel>
                <FieldContent>
                  <FormControl>
                    <Input
                      id="name"
                      placeholder="Category name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FieldContent>
              </Field>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <Field>
                <FieldLabel htmlFor="parentId">Parent Category</FieldLabel>
                <FieldContent>
                  <Select
                    value={field.value || 'none'}
                    onValueChange={(v) => field.onChange(v === 'none' ? null : v)}
                  >
                    <FormControl>
                      <SelectTrigger id="parentId">
                        <SelectValue placeholder="None (Top Level)" />
                      </SelectTrigger>
                    </FormControl>
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
                  <FormMessage />
                </FieldContent>
              </Field>
            </FormItem>
          )}
        />
      </FieldGroup>
    </FieldSet>
  )
}
