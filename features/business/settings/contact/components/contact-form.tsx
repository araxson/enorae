'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Stack, Grid } from '@/components/layout'
import { H3, Muted } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { Database } from '@/lib/types/database.types'
import { updateSalonContactDetails, type ContactDetailsInput } from '../api/mutations'

type SalonContactDetails = Database['organization']['Tables']['salon_contact_details']['Row']

interface ContactFormProps {
  salonId: string
  contactDetails: SalonContactDetails | null
}

export function ContactForm({ salonId, contactDetails }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)

    const input: ContactDetailsInput = {
      primary_phone: formData.get('primary_phone') as string || null,
      secondary_phone: formData.get('secondary_phone') as string || null,
      primary_email: formData.get('primary_email') as string || null,
      booking_email: formData.get('booking_email') as string || null,
      website_url: formData.get('website_url') as string || null,
      booking_url: formData.get('booking_url') as string || null,
      facebook_url: formData.get('facebook_url') as string || null,
      instagram_url: formData.get('instagram_url') as string || null,
      twitter_url: formData.get('twitter_url') as string || null,
      tiktok_url: formData.get('tiktok_url') as string || null,
      linkedin_url: formData.get('linkedin_url') as string || null,
      youtube_url: formData.get('youtube_url') as string || null,
      whatsapp_number: formData.get('whatsapp_number') as string || null,
      telegram_username: formData.get('telegram_username') as string || null,
      hours_display_text: formData.get('hours_display_text') as string || null,
    }

    const result = await updateSalonContactDetails(salonId, input)

    if (result.success) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError(result.error)
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="xl">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>Contact details updated successfully!</AlertDescription>
          </Alert>
        )}

        {/* Phone & Email */}
        <Card className="p-6">
          <Stack gap="lg">
            <H3>Phone & Email</H3>
            <Separator />

            <Grid cols={{ base: 1, md: 2 }} gap="lg">
              <Stack gap="sm">
                <Label htmlFor="primary_phone">Primary Phone</Label>
                <Input
                  id="primary_phone"
                  name="primary_phone"
                  type="tel"
                  defaultValue={contactDetails?.primary_phone || ''}
                  placeholder="+1 (555) 123-4567"
                />
              </Stack>

              <Stack gap="sm">
                <Label htmlFor="secondary_phone">Secondary Phone</Label>
                <Input
                  id="secondary_phone"
                  name="secondary_phone"
                  type="tel"
                  defaultValue={contactDetails?.secondary_phone || ''}
                  placeholder="+1 (555) 987-6543"
                />
              </Stack>

              <Stack gap="sm">
                <Label htmlFor="primary_email">Primary Email</Label>
                <Input
                  id="primary_email"
                  name="primary_email"
                  type="email"
                  defaultValue={contactDetails?.primary_email || ''}
                  placeholder="contact@salon.com"
                />
              </Stack>

              <Stack gap="sm">
                <Label htmlFor="booking_email">Booking Email</Label>
                <Input
                  id="booking_email"
                  name="booking_email"
                  type="email"
                  defaultValue={contactDetails?.booking_email || ''}
                  placeholder="bookings@salon.com"
                />
              </Stack>
            </Grid>
          </Stack>
        </Card>

        {/* Website & Booking */}
        <Card className="p-6">
          <Stack gap="lg">
            <H3>Website & Booking</H3>
            <Separator />

            <Grid cols={{ base: 1, md: 2 }} gap="lg">
              <Stack gap="sm">
                <Label htmlFor="website_url">Website URL</Label>
                <Input
                  id="website_url"
                  name="website_url"
                  type="url"
                  defaultValue={contactDetails?.website_url || ''}
                  placeholder="https://www.yoursalon.com"
                />
              </Stack>

              <Stack gap="sm">
                <Label htmlFor="booking_url">Booking URL</Label>
                <Input
                  id="booking_url"
                  name="booking_url"
                  type="url"
                  defaultValue={contactDetails?.booking_url || ''}
                  placeholder="https://book.yoursalon.com"
                />
              </Stack>
            </Grid>
          </Stack>
        </Card>

        {/* Social Media */}
        <Card className="p-6">
          <Stack gap="lg">
            <H3>Social Media</H3>
            <Separator />

            <Grid cols={{ base: 1, md: 2 }} gap="lg">
              <Stack gap="sm">
                <Label htmlFor="facebook_url">Facebook</Label>
                <Input
                  id="facebook_url"
                  name="facebook_url"
                  type="url"
                  defaultValue={contactDetails?.facebook_url || ''}
                  placeholder="https://facebook.com/yoursalon"
                />
              </Stack>

              <Stack gap="sm">
                <Label htmlFor="instagram_url">Instagram</Label>
                <Input
                  id="instagram_url"
                  name="instagram_url"
                  type="url"
                  defaultValue={contactDetails?.instagram_url || ''}
                  placeholder="https://instagram.com/yoursalon"
                />
              </Stack>

              <Stack gap="sm">
                <Label htmlFor="twitter_url">Twitter/X</Label>
                <Input
                  id="twitter_url"
                  name="twitter_url"
                  type="url"
                  defaultValue={contactDetails?.twitter_url || ''}
                  placeholder="https://twitter.com/yoursalon"
                />
              </Stack>

              <Stack gap="sm">
                <Label htmlFor="tiktok_url">TikTok</Label>
                <Input
                  id="tiktok_url"
                  name="tiktok_url"
                  type="url"
                  defaultValue={contactDetails?.tiktok_url || ''}
                  placeholder="https://tiktok.com/@yoursalon"
                />
              </Stack>

              <Stack gap="sm">
                <Label htmlFor="linkedin_url">LinkedIn</Label>
                <Input
                  id="linkedin_url"
                  name="linkedin_url"
                  type="url"
                  defaultValue={contactDetails?.linkedin_url || ''}
                  placeholder="https://linkedin.com/company/yoursalon"
                />
              </Stack>

              <Stack gap="sm">
                <Label htmlFor="youtube_url">YouTube</Label>
                <Input
                  id="youtube_url"
                  name="youtube_url"
                  type="url"
                  defaultValue={contactDetails?.youtube_url || ''}
                  placeholder="https://youtube.com/@yoursalon"
                />
              </Stack>
            </Grid>
          </Stack>
        </Card>

        {/* Messaging Apps */}
        <Card className="p-6">
          <Stack gap="lg">
            <H3>Messaging Apps</H3>
            <Separator />

            <Grid cols={{ base: 1, md: 2 }} gap="lg">
              <Stack gap="sm">
                <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                <Input
                  id="whatsapp_number"
                  name="whatsapp_number"
                  type="tel"
                  defaultValue={contactDetails?.whatsapp_number || ''}
                  placeholder="+1 (555) 123-4567"
                />
              </Stack>

              <Stack gap="sm">
                <Label htmlFor="telegram_username">Telegram Username</Label>
                <Input
                  id="telegram_username"
                  name="telegram_username"
                  defaultValue={contactDetails?.telegram_username || ''}
                  placeholder="@yoursalon"
                />
              </Stack>
            </Grid>
          </Stack>
        </Card>

        {/* Hours Display */}
        <Card className="p-6">
          <Stack gap="lg">
            <H3>Hours Display Text</H3>
            <Separator />

            <Stack gap="sm">
              <Label htmlFor="hours_display_text">Display Text</Label>
              <Textarea
                id="hours_display_text"
                name="hours_display_text"
                defaultValue={contactDetails?.hours_display_text || ''}
                placeholder="Mon-Fri: 9am-7pm, Sat: 10am-6pm, Sun: Closed"
                rows={3}
              />
              <Muted>Optional: Custom text to display for business hours</Muted>
            </Stack>
          </Stack>
        </Card>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Contact Details'}
        </Button>
      </Stack>
    </form>
  )
}
