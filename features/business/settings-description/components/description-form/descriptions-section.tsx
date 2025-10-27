'use client'

import { Textarea } from '@/components/ui/textarea'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'

type DescriptionFieldState = {
  short_description: string | null
  full_description: string | null
  welcome_message: string | null
  cancellation_policy: string | null
}

type DescriptionsSectionProps = {
  values: DescriptionFieldState
}

export function DescriptionsSection({ values }: DescriptionsSectionProps) {
  return (
    <FieldSet className="flex flex-col gap-6">
      <Field>
        <FieldLabel htmlFor="short_description">Short Description</FieldLabel>
        <FieldContent>
          <Textarea
            id="short_description"
            name="short_description"
            defaultValue={values.short_description ?? ''}
            placeholder="A quick summary of your salon's vibe and specialties"
            rows={3}
          />
        </FieldContent>
        <FieldDescription>Shown on overview pages and search results (max 160 characters).</FieldDescription>
      </Field>

      <Field>
        <FieldLabel htmlFor="full_description">Full Description</FieldLabel>
        <FieldContent>
          <Textarea
            id="full_description"
            name="full_description"
            defaultValue={values.full_description ?? ''}
            placeholder="Tell your full story, services, and unique selling points"
            rows={6}
          />
        </FieldContent>
        <FieldDescription>Displayed on your salon profile page.</FieldDescription>
      </Field>

      <Field>
        <FieldLabel htmlFor="welcome_message">Welcome Message</FieldLabel>
        <FieldContent>
          <Textarea
            id="welcome_message"
            name="welcome_message"
            defaultValue={values.welcome_message ?? ''}
            placeholder="Warm greeting shown to new customers"
            rows={3}
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="cancellation_policy">Cancellation Policy</FieldLabel>
        <FieldContent>
          <Textarea
            id="cancellation_policy"
            name="cancellation_policy"
            defaultValue={values.cancellation_policy ?? ''}
            placeholder="Outline how customers should cancel or reschedule"
            rows={4}
          />
        </FieldContent>
      </Field>
    </FieldSet>
  )
}
