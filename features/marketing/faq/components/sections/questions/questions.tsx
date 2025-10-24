import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { questionsData } from './questions.data'

export function Questions() {
  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8 max-w-3xl mx-auto">
        <h2 className="scroll-m-20 text-center">{questionsData.title}</h2>

        {questionsData.categories.map((category) => (
          <div key={category.name} className="flex flex-col gap-6">
            <h3 className="scroll-m-20">{category.name}</h3>
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
          </div>
        ))}
      </div>
    </section>
  )
}
