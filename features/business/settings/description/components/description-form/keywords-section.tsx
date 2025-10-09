'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Stack } from '@/components/layout'
import { H3 } from '@/components/ui/typography'
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
          <H3>SEO Keywords</H3>
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
