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
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

import { questionsData } from './questions.data'

export function Questions() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <ItemGroup className="gap-6">
        <Item className="flex-col items-center text-center" variant="muted">
          <ItemHeader>
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
              {questionsData.title}
            </h2>
          </ItemHeader>
        </Item>

        <ItemGroup className="gap-6">
          {questionsData.categories.map((category) => (
            <Item key={category.name} className="flex-col" variant="outline">
              <ItemContent>
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
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      </ItemGroup>
    </section>
  )
}
