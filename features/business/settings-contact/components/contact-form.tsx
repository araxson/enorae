'use client'

import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import type { Database } from '@/lib/types/database.types'

import { MessagingHoursSection } from './contact-form/messaging-hours-section'
import { PhoneEmailSection } from './contact-form/phone-email-section'
import { SocialLinksSection } from './contact-form/social-links-section'
import { useContactForm } from './contact-form/use-contact-form'
import { WebsiteBookingSection } from './contact-form/website-booking-section'

type SalonContactDetails = Database['public']['Views']['salon_contact_details_view']['Row']

type ContactFormProps = {
  salonId: string
  contactDetails: SalonContactDetails | null
}

export function ContactForm({ salonId, contactDetails }: ContactFormProps) {
  const { state, handlers } = useContactForm({ salonId, contactDetails })

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
            <AlertTitle>Contact details saved</AlertTitle>
            <AlertDescription>Contact details updated successfully!</AlertDescription>
          </Alert>
        )}

        <Accordion type="multiple" defaultValue={['phone-email', 'website-booking', 'social-links', 'messaging-hours']} className="w-full">
          <AccordionItem value="phone-email">
            <AccordionTrigger>Phone and Email</AccordionTrigger>
            <AccordionContent>
              <div className="pt-4">
                <PhoneEmailSection
                  initialValues={{
                    primary_phone: state.initialValues.primary_phone ?? null,
                    secondary_phone: state.initialValues.secondary_phone ?? null,
                    primary_email: state.initialValues.primary_email ?? null,
                    booking_email: state.initialValues.booking_email ?? null,
                  }}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="website-booking">
            <AccordionTrigger>Website & Booking</AccordionTrigger>
            <AccordionContent>
              <div className="pt-4">
                <WebsiteBookingSection
                  initialValues={{
                    website_url: state.initialValues.website_url ?? null,
                    booking_url: state.initialValues.booking_url ?? null,
                  }}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="social-links">
            <AccordionTrigger>Social Media Links</AccordionTrigger>
            <AccordionContent>
              <div className="pt-4">
                <SocialLinksSection
                  initialValues={{
                    facebook_url: state.initialValues.facebook_url ?? null,
                    instagram_url: state.initialValues.instagram_url ?? null,
                    twitter_url: state.initialValues.twitter_url ?? null,
                    tiktok_url: state.initialValues.tiktok_url ?? null,
                    linkedin_url: state.initialValues.linkedin_url ?? null,
                    youtube_url: state.initialValues.youtube_url ?? null,
                  }}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="messaging-hours">
            <AccordionTrigger>Messaging & Hours</AccordionTrigger>
            <AccordionContent>
              <div className="pt-4">
                <MessagingHoursSection
                  whatsapp={state.initialValues.whatsapp_number ?? null}
                  telegram={state.initialValues.telegram_username ?? null}
                  hours={state.initialValues.hours_display_text ?? null}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex justify-end">
          <Button type="submit" disabled={state.isSubmitting}>
            {state.isSubmitting ? 'Saving...' : 'Save Contact Details'}
          </Button>
        </div>
      </div>
    </form>
  )
}
