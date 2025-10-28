import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { MarketingSection } from '@/features/marketing/common-components'
import { forBusinessesData } from './for-businesses.data'

export function ForBusinesses() {
  return (
    <MarketingSection className="bg-muted/30" spacing="normal">
      <Item className="mx-auto flex-col items-center text-center" variant="muted">
        <ItemHeader>
          <ItemTitle>{forBusinessesData.title}</ItemTitle>
        </ItemHeader>
        <ItemContent>
          <ItemDescription>{forBusinessesData.subtitle}</ItemDescription>
        </ItemContent>
      </Item>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {forBusinessesData.steps.map((step) => (
          <Item key={step.step} className="flex-col" variant="outline">
            <ItemHeader className="flex-col items-start gap-2">
              <Badge variant="secondary" aria-label={`Step ${step.step}`}>
                Step {step.step}
              </Badge>
              <ItemTitle>{step.title}</ItemTitle>
            </ItemHeader>
            <ItemContent>
              <ItemDescription>{step.description}</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </div>
    </MarketingSection>
  )
}
