'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
      <CardHeader>
        <CardTitle>Awards and certifications</CardTitle>
        <CardDescription>Highlight recognitions that build trust with clients.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
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
      </CardContent>
    </Card>
  )
}
