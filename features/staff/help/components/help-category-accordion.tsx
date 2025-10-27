import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

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
        <ItemGroup>
          <Item variant="muted" size="sm">
            <ItemContent>
              <CardTitle>Categories</CardTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="space-y-3">
          {categories.map((category) => (
            <AccordionItem key={category.id} value={category.id}>
              <AccordionTrigger>
                <ItemGroup>
                  <Item variant="muted" size="sm">
                    <ItemContent>
                      <ItemTitle>{category.name}</ItemTitle>
                    </ItemContent>
                    <ItemActions>
                      <Badge variant="outline">Follow</Badge>
                    </ItemActions>
                  </Item>
                </ItemGroup>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {category.description}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
