'use client'

import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type CategoryFieldsProps = {
  nameError?: string
  descError?: string
  defaultName?: string
  defaultDesc?: string
}

export function CategoryFields({ nameError, descError, defaultName, defaultDesc }: CategoryFieldsProps) {
  return (
    <>
      <Field>
        <FieldLabel htmlFor="name">
          Category Name
          <span className="text-destructive" aria-label="required"> *</span>
        </FieldLabel>
        <Input
          id="name"
          name="name"
          required
          aria-required="true"
          aria-invalid={!!nameError}
          aria-describedby={nameError ? 'name-error' : undefined}
          defaultValue={defaultName}
          placeholder="e.g., Hair Services"
        />
        {nameError && (
          <p id="name-error" className="text-sm text-destructive mt-1" role="alert">
            {nameError}
          </p>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="description">
          Description
        </FieldLabel>
        <Textarea
          id="description"
          name="description"
          aria-invalid={!!descError}
          aria-describedby={descError ? 'description-error' : undefined}
          defaultValue={defaultDesc}
          placeholder="Brief description of this category"
          rows={3}
        />
        {descError && (
          <p id="description-error" className="text-sm text-destructive mt-1" role="alert">
            {descError}
          </p>
        )}
      </Field>
    </>
  )
}
