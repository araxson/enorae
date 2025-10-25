'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { ArrayInput } from './array-input'

type KeywordsSectionProps = {
  keywords: string[]
  onKeywordsChange: (values: string[]) => void
}

export function KeywordsSection({ keywords, onKeywordsChange }: KeywordsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO keywords</CardTitle>
        <CardDescription>List the terms clients use to find your services.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <ArrayInput
          label="Meta keywords"
          items={keywords}
          onAdd={(value) => onKeywordsChange([...keywords, value])}
          onRemove={(index) => onKeywordsChange(keywords.filter((_, idx) => idx !== index))}
          placeholder="Salon, Spa, Beauty, ..."
        />
      </CardContent>
    </Card>
  )
}
