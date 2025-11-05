'use client'

import type { Ref } from 'react'

type PersonalInfoSectionProps = {
  errors?: Record<string, string[]>
  isPending: boolean
  fullName?: string | null
  title?: string | null
  experienceYears?: number | null
  bio?: string | null
  isEditMode: boolean
  firstErrorRef?: Ref<HTMLInputElement>
}

export function PersonalInfoSection({
  errors,
  isPending,
  fullName,
  title,
  experienceYears,
  bio,
  isEditMode,
  firstErrorRef,
}: PersonalInfoSectionProps) {
  return (
    <>
      <div>
        <label htmlFor="full_name" className="block font-medium mb-1">
          Full Name
          <span className="text-destructive" aria-label="required"> *</span>
        </label>
        <input
          ref={!isEditMode && !errors?.['email'] && errors?.['full_name'] ? firstErrorRef : null}
          id="full_name"
          name="full_name"
          type="text"
          required
          aria-required="true"
          aria-invalid={!!errors?.['full_name']}
          aria-describedby={errors?.['full_name'] ? 'full_name-error' : undefined}
          disabled={isPending}
          defaultValue={fullName || ''}
          placeholder="John Doe"
          className={`w-full px-3 py-2 border rounded-md ${
            errors?.['full_name'] ? 'border-destructive' : 'border-input'
          }`}
        />
        {errors?.['full_name'] && (
          <p id="full_name-error" className="text-sm text-destructive mt-1" role="alert">
            {errors['full_name'][0]}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="title" className="block font-medium mb-1">
            Job Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            aria-invalid={!!errors?.['title']}
            aria-describedby={errors?.['title'] ? 'title-error' : undefined}
            disabled={isPending}
            defaultValue={title || ''}
            placeholder="Senior Stylist"
            className={`w-full px-3 py-2 border rounded-md ${
              errors?.['title'] ? 'border-destructive' : 'border-input'
            }`}
          />
          {errors?.['title'] && (
            <p id="title-error" className="text-sm text-destructive mt-1" role="alert">
              {errors['title'][0]}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="experience_years" className="block font-medium mb-1">
            Years of Experience
          </label>
          <input
            id="experience_years"
            name="experience_years"
            type="number"
            min="0"
            max="100"
            aria-invalid={!!errors?.['experience_years']}
            aria-describedby={errors?.['experience_years'] ? 'experience_years-error' : undefined}
            disabled={isPending}
            defaultValue={experienceYears || ''}
            placeholder="5"
            className={`w-full px-3 py-2 border rounded-md ${
              errors?.['experience_years'] ? 'border-destructive' : 'border-input'
            }`}
          />
          {errors?.['experience_years'] && (
            <p id="experience_years-error" className="text-sm text-destructive mt-1" role="alert">
              {errors['experience_years'][0]}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="block font-medium mb-1">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          aria-invalid={!!errors?.['bio']}
          aria-describedby={errors?.['bio'] ? 'bio-error' : undefined}
          disabled={isPending}
          defaultValue={bio || ''}
          placeholder="Brief professional bio..."
          className={`w-full px-3 py-2 border rounded-md ${
            errors?.['bio'] ? 'border-destructive' : 'border-input'
          }`}
        />
        {errors?.['bio'] && (
          <p id="bio-error" className="text-sm text-destructive mt-1" role="alert">
            {errors['bio'][0]}
          </p>
        )}
      </div>
    </>
  )
}
