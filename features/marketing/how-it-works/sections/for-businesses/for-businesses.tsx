import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { forBusinessesData } from './for-businesses.data'

export function ForBusinesses() {
  return (
    <section className="bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <ItemGroup className="gap-10">
          <Item className="mx-auto flex-col items-center text-center" variant="muted">
            <ItemHeader>
              <h2 className="scroll-m-20">{forBusinessesData.title}</h2>
            </ItemHeader>
            <ItemContent>
              <ItemDescription>{forBusinessesData.subtitle}</ItemDescription>
            </ItemContent>
          </Item>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {forBusinessesData.steps.map((step) => (
              <Item key={step.step} className="flex-col" variant="outline">
                <ItemContent>
                  <div className="mb-2">
                    <Badge variant="secondary">Step {step.step}</Badge>
                  </div>
                  <ItemTitle>{step.title}</ItemTitle>
                  <ItemDescription>{step.description}</ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </div>
        </ItemGroup>
      </div>
    </section>
  )
}
