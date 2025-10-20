import { Section, Stack } from '@/components/layout'
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
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight text-center">{questionsData.title}</h2>

        {questionsData.categories.map((category) => (
          <Stack gap="lg" key={category.name}>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{category.name}</h3>
            <Accordion type="multiple" className="w-full">
              {category.questions.map((item, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>
                    <p className="leading-7">{item.a}</p>
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
