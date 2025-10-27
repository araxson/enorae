'use client'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Label htmlFor="short_description">Short Description</Label>
        <Textarea
          id="short_description"
          name="short_description"
          defaultValue={values.short_description ?? ''}
          placeholder="A quick summary of your salon's vibe and specialties"
          rows={3}
        />
        <p className="text-sm text-muted-foreground">Shown on overview pages and search results (max 160 characters)</p>
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="full_description">Full Description</Label>
        <Textarea
          id="full_description"
          name="full_description"
          defaultValue={values.full_description ?? ''}
          placeholder="Tell your full story, services, and unique selling points"
          rows={6}
        />
        <p className="text-sm text-muted-foreground">Displayed on your salon profile page</p>
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="welcome_message">Welcome Message</Label>
        <Textarea
          id="welcome_message"
          name="welcome_message"
          defaultValue={values.welcome_message ?? ''}
          placeholder="Warm greeting shown to new customers"
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="cancellation_policy">Cancellation Policy</Label>
        <Textarea
          id="cancellation_policy"
          name="cancellation_policy"
          defaultValue={values.cancellation_policy ?? ''}
          placeholder="Outline how customers should cancel or reschedule"
          rows={4}
        />
      </div>
    </div>
  )
}
