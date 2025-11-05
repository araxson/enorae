'use client'

import type { Ref } from 'react'

type ContactInfoSectionProps = {
  errors?: Record<string, string[]>
  isPending: boolean
  email?: string
  phone?: string | null
  isEditMode: boolean
  firstErrorRef?: Ref<HTMLInputElement>
}

export function ContactInfoSection({
  errors,
  isPending,
  email,
  phone,
  isEditMode,
  firstErrorRef,
}: ContactInfoSectionProps) {
  return (
    <>
      {!isEditMode && (
        <div>
          <label htmlFor="email" className="block font-medium mb-1">
            Email Address
            <span className="text-destructive" aria-label="required"> *</span>
          </label>
          <input
            ref={errors?.['email'] ? firstErrorRef : null}
            id="email"
            name="email"
            type="email"
            required
            aria-required="true"
            aria-invalid={!!errors?.['email']}
            aria-describedby={errors?.['email'] ? 'email-error' : undefined}
            disabled={isPending}
            placeholder="staff@example.com"
            className={`w-full px-3 py-2 border rounded-md ${
              errors?.['email'] ? 'border-destructive' : 'border-input'
            }`}
          />
          {errors?.['email'] && (
            <p id="email-error" className="text-sm text-destructive mt-1" role="alert">
              {errors['email'][0]}
            </p>
          )}
        </div>
      )}

      {!isEditMode && (
        <div>
          <label htmlFor="phone" className="block font-medium mb-1">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            aria-invalid={!!errors?.['phone']}
            aria-describedby={errors?.['phone'] ? 'phone-error phone-hint' : 'phone-hint'}
            disabled={isPending}
            defaultValue={phone || ''}
            placeholder="+1 (555) 000-0000"
            className={`w-full px-3 py-2 border rounded-md ${
              errors?.['phone'] ? 'border-destructive' : 'border-input'
            }`}
          />
          <p id="phone-hint" className="text-sm text-muted-foreground mt-1">
            International format with country code (e.g., +1 for US)
          </p>
          {errors?.['phone'] && (
            <p id="phone-error" className="text-sm text-destructive mt-1" role="alert">
              {errors['phone'][0]}
            </p>
          )}
        </div>
      )}
    </>
  )
}
