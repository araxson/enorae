import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { questionsData } from './questions.data'

export function Questions() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
            {questionsData.title}
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          {questionsData.categories.map((category) => (
            <Card key={category.name}>
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple">
                  {category.questions.map((item, index) => {
                    const itemValue = `${category.name.toLowerCase().replace(/\s+/g, '-')}-${index}`
                    return (
                      <AccordionItem key={item.q} value={itemValue}>
                        <AccordionTrigger>{item.q}</AccordionTrigger>
                        <AccordionContent>
                          <CardDescription>{item.a}</CardDescription>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
