import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { MarketingSection } from '@/features/marketing/common-components'

import { questionsData } from './questions.data'

export function Questions() {
  return (
    <MarketingSection spacing="compact" groupClassName="gap-6">
      <Item variant="muted">
        <ItemContent>
          <div className="flex flex-col items-center text-center">
            <ItemTitle>{questionsData.title}</ItemTitle>
          </div>
        </ItemContent>
      </Item>

      {questionsData.categories.map((category) => (
        <Item key={category.name} variant="outline">
          <ItemContent>
            <div className="flex flex-col gap-4">
              <ItemTitle>{category.name}</ItemTitle>
              <Accordion type="multiple">
              {category.questions.map((item, index) => {
                const itemValue = `${category.name.toLowerCase().replace(/\s+/g, '-')}-${index}`
                return (
                  <AccordionItem key={item.q} value={itemValue}>
                    <AccordionTrigger>{item.q}</AccordionTrigger>
                    <AccordionContent>
                      <ItemDescription>{item.a}</ItemDescription>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
            </div>
          </ItemContent>
        </Item>
      ))}
    </MarketingSection>
  )
}
