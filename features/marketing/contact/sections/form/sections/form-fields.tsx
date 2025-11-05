'use client'

import { RefObject } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'

interface FormFieldsProps {
  errors?: Record<string, string[]>
  isPending: boolean
  firstErrorRef: RefObject<HTMLInputElement | null>
}

export function FormFields({ errors, isPending, firstErrorRef }: FormFieldsProps) {
  return (
    <FieldSet>
      {/* Name field */}
      <Field>
        <FieldLabel htmlFor="name">
          Name <span className="text-destructive" aria-label="required">*</span>
        </FieldLabel>
        <FieldContent>
          <Input
            ref={errors?.['name'] ? firstErrorRef : null}
            id="name"
            name="name"
            type="text"
            placeholder="Your name"
            required
            aria-required="true"
            aria-invalid={!!errors?.['name']}
            aria-describedby={errors?.['name'] ? 'name-error' : undefined}
            disabled={isPending}
          />
          {errors?.['name'] && (
            <FieldError id="name-error" role="alert">
              {errors['name'][0]}
            </FieldError>
          )}
        </FieldContent>
      </Field>

      {/* Email field */}
      <Field>
        <FieldLabel htmlFor="email">
          Email <span className="text-destructive" aria-label="required">*</span>
        </FieldLabel>
        <FieldContent>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            required
            aria-required="true"
            aria-invalid={!!errors?.['email']}
            aria-describedby={errors?.['email'] ? 'email-error' : undefined}
            disabled={isPending}
          />
          {errors?.['email'] && (
            <FieldError id="email-error" role="alert">
              {errors['email'][0]}
            </FieldError>
          )}
        </FieldContent>
      </Field>

      {/* Phone field */}
      <Field>
        <FieldLabel htmlFor="phone">Phone</FieldLabel>
        <FieldContent>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="(optional)"
            aria-invalid={!!errors?.['phone']}
            aria-describedby={errors?.['phone'] ? 'phone-error' : undefined}
            disabled={isPending}
          />
          {errors?.['phone'] && (
            <FieldError id="phone-error" role="alert">
              {errors['phone'][0]}
            </FieldError>
          )}
        </FieldContent>
      </Field>

      {/* Topic field */}
      <Field>
        <FieldLabel htmlFor="topic">Topic</FieldLabel>
        <FieldContent>
          <Input
            id="topic"
            name="topic"
            type="text"
            placeholder="What is this about? (optional)"
            aria-invalid={!!errors?.['topic']}
            aria-describedby={errors?.['topic'] ? 'topic-error' : undefined}
            disabled={isPending}
          />
          {errors?.['topic'] && (
            <FieldError id="topic-error" role="alert">
              {errors['topic'][0]}
            </FieldError>
          )}
        </FieldContent>
      </Field>

      {/* Message field */}
      <Field>
        <FieldLabel htmlFor="message">
          Message <span className="text-destructive" aria-label="required">*</span>
        </FieldLabel>
        <FieldContent>
          <Textarea
            id="message"
            name="message"
            placeholder="Your message"
            rows={5}
            required
            aria-required="true"
            aria-invalid={!!errors?.['message']}
            aria-describedby={errors?.['message'] ? 'message-error' : undefined}
            disabled={isPending}
          />
          {errors?.['message'] && (
            <FieldError id="message-error" role="alert">
              {errors['message'][0]}
            </FieldError>
          )}
        </FieldContent>
      </Field>
    </FieldSet>
  )
}
