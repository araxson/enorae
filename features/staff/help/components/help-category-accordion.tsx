import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
type ResourceCategory = {
  id: string
  name: string
  description: string
}

interface HelpCategoryAccordionProps {
  categories: readonly ResourceCategory[]
}

export function HelpCategoryAccordion({ categories }: HelpCategoryAccordionProps) {
  if (!categories.length) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="space-y-3">
          {categories.map((category) => (
            <AccordionItem key={category.id} value={category.id}>
              <AccordionTrigger>
                <div className="flex w-full items-center justify-between gap-4 text-left">
                  <span className="text-sm font-medium">{category.name}</span>
                  <Badge variant="outline">Follow</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {category.description}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
