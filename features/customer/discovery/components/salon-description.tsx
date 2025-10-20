import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stack } from '@/components/layout'
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
              <p className="leading-7 text-center italic">{description.welcome_message}</p>
            </div>
          )}

          {/* Short Description */}
          {description.short_description && (
            <div>
              <p className="leading-7 font-medium">{description.short_description}</p>
            </div>
          )}

          {/* Full Description */}
          {description.full_description && (
            <>
              <Separator />
              <div>
                <p className="leading-7 whitespace-pre-line">{description.full_description}</p>
              </div>
            </>
          )}

          {/* Amenities */}
          {description.amenities && Array.isArray(description.amenities) && description.amenities.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-3 text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Amenities
                </h3>
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
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-3 text-base">Specialties</h3>
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
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-3 text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Methods
              </h3>
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
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-3 text-base flex items-center gap-2">
                <Languages className="h-4 w-4" />
                Languages Spoken
              </h3>
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
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-3 text-base flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Awards & Certifications
                </h3>
                <Stack gap="sm">
                  {description.awards && Array.isArray(description.awards) && description.awards.map((award, idx) => (
                    <div key={`award-${idx}`} className="flex items-start gap-2">
                      <Award className="h-4 w-4 mt-0.5 text-warning" />
                      <p className="text-sm text-muted-foreground text-sm">{String(award)}</p>
                    </div>
                  ))}
                  {description.certifications && Array.isArray(description.certifications) && description.certifications.map((cert, idx) => (
                    <div key={`cert-${idx}`} className="flex items-start gap-2">
                      <Award className="h-4 w-4 mt-0.5 text-info" />
                      <p className="text-sm text-muted-foreground text-sm">{String(cert)}</p>
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
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-2 text-base">Cancellation Policy</h3>
                <p className="leading-7 text-sm text-muted-foreground whitespace-pre-line">
                  {description.cancellation_policy}
                </p>
              </div>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
