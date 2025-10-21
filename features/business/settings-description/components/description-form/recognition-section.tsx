'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { ArrayInput } from './array-input'

type RecognitionSectionProps = {
  awards: string[]
  certifications: string[]
  onAwardsChange: (values: string[]) => void
  onCertificationsChange: (values: string[]) => void
}

export function RecognitionSection({ awards, certifications, onAwardsChange, onCertificationsChange }: RecognitionSectionProps) {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-6">
          <h3 className="scroll-m-20 text-2xl font-semibold">Awards & Certifications</h3>
          <Separator />

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
      </CardContent>
    </Card>
  )
}
