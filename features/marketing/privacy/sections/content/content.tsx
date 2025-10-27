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
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <ItemGroup className="max-w-3xl mx-auto gap-4">
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
