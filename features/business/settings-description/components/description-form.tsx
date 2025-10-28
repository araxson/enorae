'use client'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import type { Database } from '@/lib/types/database.types'

import { DescriptionsSection } from './description-form/descriptions-section'
import { ArrayFieldsSection } from './description-form/array-fields-section'
import { SeoSection } from './description-form/seo-section'
import { useDescriptionForm } from './description-form/use-description-form'

type SalonDescription = Database['public']['Views']['salon_descriptions_view']['Row']

type DescriptionFormProps = {
  salonId: string
  description: SalonDescription | null
}

export function DescriptionForm({ salonId, description }: DescriptionFormProps) {
  const { state, actions, handlers } = useDescriptionForm({ salonId, description })

  return (
    <form onSubmit={handlers.handleSubmit}>
      <div className="flex flex-col gap-8">
        {state.error && (
          <Alert variant="destructive">
            <AlertTitle>Update failed</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        {state.success && (
          <Alert>
            <AlertTitle>Description updated</AlertTitle>
            <AlertDescription>Description updated successfully!</AlertDescription>
          </Alert>
        )}

        <Accordion type="multiple" defaultValue={['descriptions', 'seo', 'array-fields']} className="w-full">
          <AccordionItem value="descriptions">
            <AccordionTrigger>Salon Descriptions</AccordionTrigger>
            <AccordionContent>
              <div className="pt-4">
                <DescriptionsSection values={state.descriptionFields} />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="seo">
            <AccordionTrigger>SEO & Meta Information</AccordionTrigger>
            <AccordionContent>
              <div className="pt-4">
                <SeoSection
                  metaTitle={state.descriptionFields.meta_title}
                  metaDescription={state.descriptionFields.meta_description}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="array-fields">
            <AccordionTrigger>Additional Information</AccordionTrigger>
            <AccordionContent>
              <div className="pt-4">
                <ArrayFieldsSection arrays={state.arrays} onChange={actions.setArrayField} />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex justify-end">
          <Button type="submit" disabled={state.isSubmitting}>
            {state.isSubmitting ? (
              <>
                <Spinner className="size-4" />
                <span>Saving…</span>
              </>
            ) : (
              <span>Save Description</span>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
