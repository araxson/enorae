'use client'

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

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
    <Item variant="outline" className="flex-col gap-6">
      <ItemHeader>
        <div className="flex flex-col gap-1">
          <ItemTitle>Amenities and highlights</ItemTitle>
          <ItemDescription>Showcase what makes your business unique.</ItemDescription>
        </div>
      </ItemHeader>
      <ItemContent>
        <div className="flex flex-col gap-6">
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
            label="Payment methods"
            items={paymentMethods}
            onAdd={(value) => onPaymentMethodsChange([...paymentMethods, value])}
            onRemove={(index) => onPaymentMethodsChange(paymentMethods.filter((_, idx) => idx !== index))}
            placeholder="Visa, Mastercard, Cash, ..."
          />

          <ArrayInput
            label="Languages spoken"
            items={languages}
            onAdd={(value) => onLanguagesChange([...languages, value])}
            onRemove={(index) => onLanguagesChange(languages.filter((_, idx) => idx !== index))}
            placeholder="English, Spanish, ..."
          />
        </div>
      </ItemContent>
    </Item>
  )
}
