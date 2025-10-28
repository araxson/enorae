'use client'

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

import { ArrayInput } from './array-input'

type RecognitionSectionProps = {
  awards: string[]
  certifications: string[]
  onAwardsChange: (values: string[]) => void
  onCertificationsChange: (values: string[]) => void
}

export function RecognitionSection({ awards, certifications, onAwardsChange, onCertificationsChange }: RecognitionSectionProps) {
  return (
    <Item variant="outline" className="flex-col gap-6">
      <ItemHeader>
        <div className="flex flex-col gap-1">
          <ItemTitle>Awards and certifications</ItemTitle>
          <ItemDescription>Highlight recognitions that build trust with clients.</ItemDescription>
        </div>
      </ItemHeader>
      <ItemContent>
        <div className="flex flex-col gap-6">
          <ArrayInput
            label="Awards"
            items={awards}
            onAdd={(value) => onAwardsChange([...awards, value])}
            onRemove={(index) => onAwardsChange(awards.filter((_, idx) => idx !== index))}
            placeholder="Best Salon 2023, ..."
          />

          <ArrayInput
            label="Certifications"
            items={certifications}
            onAdd={(value) => onCertificationsChange([...certifications, value])}
            onRemove={(index) => onCertificationsChange(certifications.filter((_, idx) => idx !== index))}
            placeholder="Certified Colorist, ..."
          />
        </div>
      </ItemContent>
    </Item>
  )
}
