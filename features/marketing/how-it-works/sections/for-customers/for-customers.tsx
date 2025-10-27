import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { forCustomersData } from './for-customers.data'

export function ForCustomers() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <ItemGroup className="gap-10">
          <Item className="mx-auto flex-col items-center text-center" variant="muted">
            <ItemHeader>
              <h2 className="scroll-m-20">{forCustomersData.title}</h2>
            </ItemHeader>
            <ItemContent>
              <ItemDescription>{forCustomersData.subtitle}</ItemDescription>
            </ItemContent>
          </Item>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {forCustomersData.steps.map((step) => (
              <Item key={step.step} className="flex-col" variant="outline">
                <ItemContent>
                  <div className="mb-2">
                    <Badge>Step {step.step}</Badge>
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
