import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Stack, Group } from '@/components/layout'
import { Muted } from '@/components/ui/typography'
import { Phone, Mail, Globe, Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type SalonContactDetails = Database['public']['Views']['salon_contact_details']['Row']

interface SalonContactDetailsProps {
  contactDetails: SalonContactDetails
}

export function SalonContactDetails({ contactDetails }: SalonContactDetailsProps) {
  const socialLinks = [
    { icon: Facebook, url: contactDetails.facebook_url, label: 'Facebook' },
    { icon: Instagram, url: contactDetails.instagram_url, label: 'Instagram' },
    { icon: Twitter, url: contactDetails.twitter_url, label: 'Twitter' },
  ].filter(link => link.url)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap="md">
          {/* Phone */}
          {contactDetails.primary_phone && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <Muted>{contactDetails.primary_phone}</Muted>
              </div>
              <Button size="sm" variant="outline" asChild>
                <a href={`tel:${contactDetails.primary_phone}`}>Call</a>
              </Button>
            </div>
          )}

          {/* Email */}
          {contactDetails.primary_email && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Muted>{contactDetails.primary_email}</Muted>
              </div>
              <Button size="sm" variant="outline" asChild>
                <a href={`mailto:${contactDetails.primary_email}`}>Email</a>
              </Button>
            </div>
          )}

          {/* Website */}
          {contactDetails.website_url && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <Muted>Website</Muted>
              </div>
              <Button size="sm" variant="outline" asChild>
                <a href={contactDetails.website_url} target="_blank" rel="noopener noreferrer">
                  Visit
                </a>
              </Button>
            </div>
          )}

          {/* WhatsApp */}
          {contactDetails.whatsapp_number && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <Muted>WhatsApp</Muted>
              </div>
              <Button size="sm" variant="outline" asChild>
                <a
                  href={`https://wa.me/${contactDetails.whatsapp_number.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Message
                </a>
              </Button>
            </div>
          )}

          {/* Social Media */}
          {socialLinks.length > 0 && (
            <div className="pt-4 border-t">
              <Muted className="mb-3 block">Follow us</Muted>
              <Group gap="sm">
                {socialLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Button
                      key={link.label}
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      asChild
                    >
                      <a href={link.url!} target="_blank" rel="noopener noreferrer">
                        <Icon className="h-4 w-4 mr-2" />
                        {link.label}
                      </a>
                    </Button>
                  )
                })}
              </Group>
            </div>
          )}

          {/* Operating Hours Display */}
          {contactDetails.hours_display_text && (
            <div className="pt-4 border-t">
              <Muted className="mb-2 block">Hours</Muted>
              <div className="text-sm whitespace-pre-line">{contactDetails.hours_display_text}</div>
            </div>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
