'use client'

import { useCallback } from 'react'

import type { ArrayFieldState } from './use-description-form'

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
    <KeywordsSection keywords={arrays.keywords} onKeywordsChange={handleChange('keywords')} />
  )
}
