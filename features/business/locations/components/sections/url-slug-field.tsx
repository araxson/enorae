'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface UrlSlugFieldProps {
  defaultValue?: string
  isPending: boolean
  errors?: string[]
}

export function UrlSlugField({ defaultValue = '', isPending, errors }: UrlSlugFieldProps) {
  return (
    <div>
      <Label htmlFor="slug">
        URL Slug
        <span className="text-destructive" aria-label="required"> *</span>
      </Label>
      <Input
        id="slug"
        name="slug"
        type="text"
        defaultValue={defaultValue}
        placeholder="main-branch"
        required
        maxLength={200}
        pattern="[a-z0-9-]+"
        disabled={isPending}
        aria-required="true"
        aria-invalid={!!errors}
        aria-describedby={errors ? 'slug-error slug-hint' : 'slug-hint'}
      />
      <p id="slug-hint" className="text-sm text-muted-foreground mt-1">
        Use lowercase letters, numbers, and dashes only
      </p>
      {errors && (
        <p id="slug-error" className="text-sm text-destructive mt-1" role="alert">
          {errors[0]}
        </p>
      )}
    </div>
  )
}
