import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Phone, Mail, Globe, Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'
import { Separator } from '@/components/ui/separator'

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
        <CardDescription>Reach the salon using the channels below.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* Phone */}
          {contactDetails.primary_phone && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{contactDetails.primary_phone}</p>
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
                <p className="text-sm text-muted-foreground">{contactDetails.primary_email}</p>
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
                <p className="text-sm text-muted-foreground">Website</p>
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
                <p className="text-sm text-muted-foreground">WhatsApp</p>
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
            <div>
              <Separator className="my-4" />
              <p className="text-sm text-muted-foreground">Follow us</p>
              <div className="mt-3 flex items-center gap-3">
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
              </div>
            </div>
          )}

          {/* Operating Hours Display */}
          {contactDetails.hours_display_text && (
            <div>
              <Separator className="my-4" />
              <p className="text-sm text-muted-foreground">Hours</p>
              <div className="mt-2 text-sm whitespace-pre-line">{contactDetails.hours_display_text}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
