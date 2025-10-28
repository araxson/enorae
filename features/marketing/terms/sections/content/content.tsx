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
      className="bg-background"
      containerClassName="max-w-4xl"
      groupClassName="gap-6"
    >
      <Item className="flex-col" variant="muted">
        <ItemContent>
          <ItemDescription>These sections outline usage policies, payment terms, and user responsibilities.</ItemDescription>
        </ItemContent>
      </Item>
      {contentData.sections.map((section) => (
        <Item key={section.title} className="flex-col" variant="outline">
          <ItemContent>
            <ItemTitle>{section.title}</ItemTitle>
            <ItemDescription>{section.content}</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </MarketingSection>
  )
}
