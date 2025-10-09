'use client'

import { Button } from '@/components/ui/button'
import { Stack } from '@/components/layout'
import { Alert, AlertDescription } from '@/components/ui/alert'

import type { Database } from '@/lib/types/database.types'

import { DescriptionsSection } from './description-form/descriptions-section'
import { ArrayFieldsSection } from './description-form/array-fields-section'
import { SeoSection } from './description-form/seo-section'
import { useDescriptionForm } from './description-form/use-description-form'

type SalonDescription = Database['public']['Views']['salon_descriptions']['Row']

type DescriptionFormProps = {
  salonId: string
  description: SalonDescription | null
}

export function DescriptionForm({ salonId, description }: DescriptionFormProps) {
  const { state, actions, handlers } = useDescriptionForm({ salonId, description })

  return (
    <form onSubmit={handlers.handleSubmit}>
      <Stack gap="xl">
        {state.error && (
          <Alert variant="destructive">
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        {state.success && (
          <Alert>
            <AlertDescription>Description updated successfully!</AlertDescription>
          </Alert>
        )}

        <DescriptionsSection values={state.descriptionFields} />

        <SeoSection
          metaTitle={state.descriptionFields.meta_title}
          metaDescription={state.descriptionFields.meta_description}
        />

        <ArrayFieldsSection arrays={state.arrays} onChange={actions.setArrayField} />

        <div className="flex justify-end">
          <Button type="submit" disabled={state.isSubmitting}>
            {state.isSubmitting ? 'Saving...' : 'Save Description'}
          </Button>
        </div>
      </Stack>
    </form>
  )
}
