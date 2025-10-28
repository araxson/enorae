import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { MarketingSection } from '@/features/marketing/common-components'
import { forBusinessesData } from './for-businesses.data'

export function ForBusinesses() {
  return (
    <MarketingSection className="bg-muted/30" spacing="normal">
      <div className="mx-auto flex flex-col items-center text-center">
        <Item variant="muted">
          <ItemContent>
            <div className="flex flex-col items-center text-center">
              <ItemTitle>{forBusinessesData.title}</ItemTitle>
              <ItemDescription>{forBusinessesData.subtitle}</ItemDescription>
            </div>
          </ItemContent>
        </Item>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {forBusinessesData.steps.map((step) => (
          <Item key={step.step} variant="outline">
            <ItemContent>
              <div className="flex flex-col gap-2">
                <Badge variant="secondary" aria-label={`Step ${step.step}`}>
                  Step {step.step}
                </Badge>
                <ItemTitle>{step.title}</ItemTitle>
                <ItemDescription>{step.description}</ItemDescription>
              </div>
            </ItemContent>
          </Item>
        ))}
      </div>
    </MarketingSection>
  )
}
