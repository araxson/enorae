'use client'

import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
} from '@/components/ui/item'

type ServicePairing = {
  primary: string
  paired: string
  count: number
}

export function ServicePairingsSection({ pairings }: { pairings: ServicePairing[] }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {pairings.map((pair) => (
        <AccordionItem key={`${pair.primary}-${pair.paired}`} value={`${pair.primary}-${pair.paired}`}>
          <AccordionTrigger>{pair.primary}</AccordionTrigger>
          <AccordionContent>
            <ItemGroup>
              <Item>
                <ItemContent>
                  <ItemDescription>Often paired with {pair.paired}</ItemDescription>
                </ItemContent>
                <ItemActions className="flex-none">
                  <Badge variant="secondary">{pair.count} combos</Badge>
                </ItemActions>
              </Item>
            </ItemGroup>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
