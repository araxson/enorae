'use client'

import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { ArrayInput } from './array-input'

type HighlightsSectionProps = {
  amenities: string[]
  specialties: string[]
  paymentMethods: string[]
  languages: string[]
  onAmenitiesChange: (values: string[]) => void
  onSpecialtiesChange: (values: string[]) => void
  onPaymentMethodsChange: (values: string[]) => void
  onLanguagesChange: (values: string[]) => void
}

export function HighlightsSection({
  amenities,
  specialties,
  paymentMethods,
  languages,
  onAmenitiesChange,
  onSpecialtiesChange,
  onPaymentMethodsChange,
  onLanguagesChange,
}: HighlightsSectionProps) {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-6">
          <CardTitle>Amenities & Highlights</CardTitle>
          <Separator />

          <ArrayInput
            label="Amenities"
            items={amenities}
            onAdd={(value) => onAmenitiesChange([...amenities, value])}
            onRemove={(index) => onAmenitiesChange(amenities.filter((_, idx) => idx !== index))}
            placeholder="Free WiFi, Wheelchair accessible, ..."
          />

          <ArrayInput
            label="Specialties"
            items={specialties}
            onAdd={(value) => onSpecialtiesChange([...specialties, value])}
            onRemove={(index) => onSpecialtiesChange(specialties.filter((_, idx) => idx !== index))}
            placeholder="Balayage, Bridal Makeup, ..."
          />

          <ArrayInput
            label="Payment Methods"
            items={paymentMethods}
            onAdd={(value) => onPaymentMethodsChange([...paymentMethods, value])}
            onRemove={(index) =>
              onPaymentMethodsChange(paymentMethods.filter((_, idx) => idx !== index))
            }
            placeholder="Visa, Mastercard, Cash, ..."
          />

          <ArrayInput
            label="Languages Spoken"
            items={languages}
            onAdd={(value) => onLanguagesChange([...languages, value])}
            onRemove={(index) => onLanguagesChange(languages.filter((_, idx) => idx !== index))}
            placeholder="English, Spanish, ..."
          />
        </div>
      </CardContent>
    </Card>
  )
}
