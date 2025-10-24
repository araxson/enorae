'use client'

import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { ArrayInput } from './array-input'

type KeywordsSectionProps = {
  keywords: string[]
  onKeywordsChange: (values: string[]) => void
}

export function KeywordsSection({ keywords, onKeywordsChange }: KeywordsSectionProps) {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-6">
          <CardTitle>SEO Keywords</CardTitle>
          <Separator />

          <ArrayInput
            label="Meta Keywords"
            items={keywords}
            onAdd={(value) => onKeywordsChange([...keywords, value])}
            onRemove={(index) => onKeywordsChange(keywords.filter((_, idx) => idx !== index))}
            placeholder="Salon, Spa, Beauty, ..."
          />
        </div>
      </CardContent>
    </Card>
  )
}
