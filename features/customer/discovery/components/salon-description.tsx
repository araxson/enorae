import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stack } from '@/components/layout'
import { H3, P, Muted } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'
import { Award, CreditCard, Languages, Sparkles } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type SalonDescription = Database['public']['Views']['salon_descriptions']['Row']

interface SalonDescriptionProps {
  description: SalonDescription
}

export function SalonDescriptionComponent({ description }: SalonDescriptionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap="lg">
          {/* Welcome Message */}
          {description.welcome_message && (
            <div className="bg-muted/50 rounded-lg p-4">
              <P className="text-center italic">{description.welcome_message}</P>
            </div>
          )}

          {/* Short Description */}
          {description.short_description && (
            <div>
              <P className="font-medium">{description.short_description}</P>
            </div>
          )}

          {/* Full Description */}
          {description.full_description && (
            <>
              <Separator />
              <div>
                <P className="whitespace-pre-line">{description.full_description}</P>
              </div>
            </>
          )}

          {/* Amenities */}
          {description.amenities && Array.isArray(description.amenities) && description.amenities.length > 0 && (
            <>
              <Separator />
              <div>
                <H3 className="mb-3 text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Amenities
                </H3>
                <div className="flex flex-wrap gap-2">
                  {description.amenities.map((amenity, idx) => (
                    <Badge key={idx} variant="secondary">
                      {String(amenity)}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Specialties */}
          {description.specialties && Array.isArray(description.specialties) && description.specialties.length > 0 && (
            <div>
              <H3 className="mb-3 text-base">Specialties</H3>
              <div className="flex flex-wrap gap-2">
                {description.specialties.map((specialty, idx) => (
                  <Badge key={idx} variant="outline">
                    {String(specialty)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Payment Methods */}
          {description.payment_methods && Array.isArray(description.payment_methods) && description.payment_methods.length > 0 && (
            <div>
              <H3 className="mb-3 text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Methods
              </H3>
              <div className="flex flex-wrap gap-2">
                {description.payment_methods.map((method, idx) => (
                  <Badge key={idx} variant="outline">
                    {String(method)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Languages Spoken */}
          {description.languages_spoken && Array.isArray(description.languages_spoken) && description.languages_spoken.length > 0 && (
            <div>
              <H3 className="mb-3 text-base flex items-center gap-2">
                <Languages className="h-4 w-4" />
                Languages Spoken
              </H3>
              <div className="flex flex-wrap gap-2">
                {description.languages_spoken.map((language, idx) => (
                  <Badge key={idx} variant="secondary">
                    {String(language)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Awards & Certifications */}
          {((description.awards && Array.isArray(description.awards) && description.awards.length > 0) ||
            (description.certifications && Array.isArray(description.certifications) && description.certifications.length > 0)) && (
            <>
              <Separator />
              <div>
                <H3 className="mb-3 text-base flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Awards & Certifications
                </H3>
                <Stack gap="sm">
                  {description.awards && Array.isArray(description.awards) && description.awards.map((award, idx) => (
                    <div key={`award-${idx}`} className="flex items-start gap-2">
                      <Award className="h-4 w-4 mt-0.5 text-yellow-500" />
                      <Muted className="text-sm">{String(award)}</Muted>
                    </div>
                  ))}
                  {description.certifications && Array.isArray(description.certifications) && description.certifications.map((cert, idx) => (
                    <div key={`cert-${idx}`} className="flex items-start gap-2">
                      <Award className="h-4 w-4 mt-0.5 text-blue-500" />
                      <Muted className="text-sm">{String(cert)}</Muted>
                    </div>
                  ))}
                </Stack>
              </div>
            </>
          )}

          {/* Cancellation Policy */}
          {description.cancellation_policy && (
            <>
              <Separator />
              <div>
                <H3 className="mb-2 text-base">Cancellation Policy</H3>
                <P className="text-sm text-muted-foreground whitespace-pre-line">
                  {description.cancellation_policy}
                </P>
              </div>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
