import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { contentData } from './content.data'

export function Content() {
  return (
    <section className="bg-background">
      <ItemGroup className="mx-auto max-w-4xl gap-6 px-4 py-16 sm:px-6 lg:px-8">
        {contentData.sections.map((section) => (
          <Item key={section.title} className="flex-col" variant="outline">
            <ItemContent>
              <ItemTitle>{section.title}</ItemTitle>
              <ItemDescription>{section.content}</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </section>
  )
}
