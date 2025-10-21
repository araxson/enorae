'use client'

import { Card, CardContent } from '@/components/ui/card'
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
          <h3 className="scroll-m-20 text-2xl font-semibold">SEO Keywords</h3>
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
