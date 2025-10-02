import { Section, Stack } from '@/components/layout'
import { H2, H3, P } from '@/components/ui/typography'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { questionsData } from './questions.data'

export function Questions() {
  return (
    <Section size="lg">
      <Stack gap="xl" className="max-w-3xl mx-auto">
        <H2 className="text-center">{questionsData.title}</H2>

        {questionsData.categories.map((category) => (
          <Stack gap="lg" key={category.name}>
            <H3>{category.name}</H3>
            <Accordion type="multiple" className="w-full">
              {category.questions.map((item, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>
                    <P>{item.a}</P>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Stack>
        ))}
      </Stack>
    </Section>
  )
}
