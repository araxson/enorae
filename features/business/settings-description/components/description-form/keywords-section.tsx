'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Stack } from '@/components/layout'
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
        <Stack gap="lg">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">SEO Keywords</h3>
          <Separator />

          <ArrayInput
            label="Meta Keywords"
            items={keywords}
            onAdd={(value) => onKeywordsChange([...keywords, value])}
            onRemove={(index) => onKeywordsChange(keywords.filter((_, idx) => idx !== index))}
            placeholder="Salon, Spa, Beauty, ..."
          />
        </Stack>
      </CardContent>
    </Card>
  )
}
