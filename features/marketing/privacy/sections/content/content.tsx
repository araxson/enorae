import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { MarketingSection } from '@/features/marketing/common-components'
import { contentData } from './content.data'

export function Content() {
  return (
    <MarketingSection
      spacing="compact"
      containerClassName="max-w-6xl"
      groupClassName="mx-auto max-w-3xl gap-4"
    >
      <Item variant="muted">
        <ItemContent>
          <ItemDescription>We explain what data we collect, how it’s used, and your control options.</ItemDescription>
        </ItemContent>
      </Item>
      {contentData.sections.map((section) => (
        <Item key={section.title} variant="outline">
          <ItemContent>
            <ItemTitle>{section.title}</ItemTitle>
            <ItemDescription>{section.content}</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </MarketingSection>
  )
}
