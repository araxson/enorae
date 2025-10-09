'use client'

import { useCallback } from 'react'

import type { ArrayFieldState } from './use-description-form'

import { HighlightsSection } from './highlights-section'
import { RecognitionSection } from './recognition-section'
import { KeywordsSection } from './keywords-section'

type ArrayFieldsSectionProps = {
  arrays: ArrayFieldState
  onChange: (field: keyof ArrayFieldState, values: string[]) => void
}

export function ArrayFieldsSection({ arrays, onChange }: ArrayFieldsSectionProps) {
  const handleChange = useCallback(
    (field: keyof ArrayFieldState) => (values: string[]) => {
      onChange(field, values)
    },
    [onChange],
  )

  return (
    <>
      <HighlightsSection
        amenities={arrays.amenities}
        specialties={arrays.specialties}
        paymentMethods={arrays.paymentMethods}
        languages={arrays.languages}
        onAmenitiesChange={handleChange('amenities')}
        onSpecialtiesChange={handleChange('specialties')}
        onPaymentMethodsChange={handleChange('paymentMethods')}
        onLanguagesChange={handleChange('languages')}
      />

      <RecognitionSection
        awards={arrays.awards}
        certifications={arrays.certifications}
        onAwardsChange={handleChange('awards')}
        onCertificationsChange={handleChange('certifications')}
      />

      <KeywordsSection keywords={arrays.keywords} onKeywordsChange={handleChange('keywords')} />
    </>
  )
}
