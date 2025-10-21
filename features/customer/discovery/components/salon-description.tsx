import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Award, CreditCard, Languages, Sparkles } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
        <div className="flex flex-col gap-6">
          {/* Welcome Message */}
          {description.welcome_message && (
            <Alert>
              <div className="flex justify-center">
                <AlertDescription>{description.welcome_message}</AlertDescription>
              </div>
            </Alert>
          )}

          {/* Short Description */}
          {description.short_description && (
            <p className="text-foreground">{description.short_description}</p>
          )}

          {/* Full Description */}
          {description.full_description && (
            <>
              <Separator />
              <p className="whitespace-pre-line text-muted-foreground">{description.full_description}</p>
            </>
          )}

          {/* Amenities */}
          {description.amenities && Array.isArray(description.amenities) && description.amenities.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                  <Sparkles className="h-4 w-4" />
                  <span>Amenities</span>
                </div>
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
              <div className="mb-3 text-sm font-medium text-foreground">Specialties</div>
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
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <CreditCard className="h-4 w-4" />
                <span>Payment Methods</span>
              </div>
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
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <Languages className="h-4 w-4" />
                <span>Languages Spoken</span>
              </div>
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
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                  <Award className="h-4 w-4" />
                  <span>Awards & Certifications</span>
                </div>
                <div className="flex flex-col gap-3">
                  {description.awards && Array.isArray(description.awards) && description.awards.map((award, idx) => (
                    <div key={`award-${idx}`} className="flex items-start gap-2">
                      <Award className="mt-0.5 h-4 w-4" />
                      <p className="text-sm text-muted-foreground">{String(award)}</p>
                    </div>
                  ))}
                  {description.certifications && Array.isArray(description.certifications) && description.certifications.map((cert, idx) => (
                    <div key={`cert-${idx}`} className="flex items-start gap-2">
                      <Award className="mt-0.5 h-4 w-4" />
                      <p className="text-sm text-muted-foreground">{String(cert)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Cancellation Policy */}
          {description.cancellation_policy && (
            <>
              <Separator />
              <div>
                <div className="mb-2 text-sm font-medium text-foreground">Cancellation Policy</div>
                <p className="whitespace-pre-line text-sm text-muted-foreground">{description.cancellation_policy}</p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
