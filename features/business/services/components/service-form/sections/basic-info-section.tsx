'use client'

import type { Ref } from 'react'

type BasicInfoSectionProps = {
  errors?: Record<string, string[]>
  isPending: boolean
  serviceName?: string | null
  serviceDescription?: string | null
  firstErrorRef?: Ref<HTMLInputElement>
}

export function BasicInfoSection({
  errors,
  isPending,
  serviceName,
  serviceDescription,
  firstErrorRef,
}: BasicInfoSectionProps) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-lg font-semibold mb-4">Basic Information</legend>

      <div>
        <label htmlFor="name" className="block font-medium mb-1">
          Service Name
          <span className="text-destructive" aria-label="required"> *</span>
        </label>
        <input
          ref={errors?.['name'] ? firstErrorRef : null}
          id="name"
          name="name"
          type="text"
          required
          aria-required="true"
          aria-invalid={!!errors?.['name']}
          aria-describedby={errors?.['name'] ? 'name-error name-hint' : 'name-hint'}
          disabled={isPending}
          defaultValue={serviceName || ''}
          placeholder="e.g., Haircut & Style"
          className={`w-full px-3 py-2 border rounded-md ${
            errors?.['name'] ? 'border-destructive' : 'border-input'
          }`}
        />
        <p id="name-hint" className="text-sm text-muted-foreground mt-1">
          Must be at least 3 characters and contain letters
        </p>
        {errors?.['name'] && (
          <p id="name-error" className="text-sm text-destructive mt-1" role="alert">
            {errors['name'][0]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          aria-invalid={!!errors?.['description']}
          aria-describedby={errors?.['description'] ? 'description-error description-hint' : 'description-hint'}
          disabled={isPending}
          defaultValue={serviceDescription || ''}
          placeholder="Describe the service..."
          className={`w-full px-3 py-2 border rounded-md ${
            errors?.['description'] ? 'border-destructive' : 'border-input'
          }`}
        />
        <p id="description-hint" className="text-sm text-muted-foreground mt-1">
          At least 20 characters to help customers understand the service
        </p>
        {errors?.['description'] && (
          <p id="description-error" className="text-sm text-destructive mt-1" role="alert">
            {errors['description'][0]}
          </p>
        )}
      </div>
    </fieldset>
  )
}
