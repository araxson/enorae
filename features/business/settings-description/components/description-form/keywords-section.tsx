'use client'

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

import { ArrayInput } from './array-input'

type KeywordsSectionProps = {
  keywords: string[]
  onKeywordsChange: (values: string[]) => void
}

export function KeywordsSection({ keywords, onKeywordsChange }: KeywordsSectionProps) {
  return (
    <Item variant="outline" className="flex-col gap-6">
      <ItemHeader>
        <div className="flex flex-col gap-1">
          <ItemTitle>SEO keywords</ItemTitle>
          <ItemDescription>List the terms clients use to find your services.</ItemDescription>
        </div>
      </ItemHeader>
      <ItemContent>
        <div className="flex flex-col gap-6">
          <ArrayInput
            label="Meta keywords"
            items={keywords}
            onAdd={(value) => onKeywordsChange([...keywords, value])}
            onRemove={(index) => onKeywordsChange(keywords.filter((_, idx) => idx !== index))}
            placeholder="Salon, Spa, Beauty, ..."
          />
        </div>
      </ItemContent>
    </Item>
  )
}
