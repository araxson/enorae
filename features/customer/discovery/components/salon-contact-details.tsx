import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Phone, Mail, Globe, Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'
import { Separator } from '@/components/ui/separator'

type SalonContactDetails = Database['public']['Views']['salons_view']['Row']

interface SalonContactDetailsProps {
  contactDetails: SalonContactDetails
}

export function SalonContactDetails({ contactDetails }: SalonContactDetailsProps) {
  // Note: Social media links not available in current database schema
  const socialLinks: Array<{ icon: typeof Facebook; url: string; label: string }> = []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>Reach the salon using the channels below.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* Phone */}
          {contactDetails['primary_phone'] && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{contactDetails['primary_phone']}</p>
              </div>
              <Button size="sm" variant="outline" asChild>
                <a href={`tel:${contactDetails['primary_phone']}`}>Call</a>
              </Button>
            </div>
          )}

          {/* Email */}
          {contactDetails['primary_email'] && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{contactDetails['primary_email']}</p>
              </div>
              <Button size="sm" variant="outline" asChild>
                <a href={`mailto:${contactDetails['primary_email']}`}>Email</a>
              </Button>
            </div>
          )}

          {/* Website */}
          {contactDetails['website_url'] && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Website</p>
              </div>
              <Button size="sm" variant="outline" asChild>
                <a href={contactDetails['website_url']} target="_blank" rel="noopener noreferrer">
                  Visit
                </a>
              </Button>
            </div>
          )}

          {/* Note: WhatsApp, social media, and hours display not available in current database schema */}
        </div>
      </CardContent>
    </Card>
  )
}
