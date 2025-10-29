import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item'
import { MarketingSection, TestimonialCard } from '@/features/marketing/common-components'

import { testimonials } from './testimonials.data'

export function Testimonials() {
  return (
    <MarketingSection spacing="compact" groupClassName="gap-0">
      <Item variant="outline" className="flex flex-col gap-6">
        <ItemHeader className="flex flex-col items-center text-center">
          <ItemTitle>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              What our users say
            </h2>
          </ItemTitle>
          <p className="text-muted-foreground text-base md:text-lg">
            Trusted by thousands of customers and salon professionals
          </p>
        </ItemHeader>
        <ItemContent>
          <div className="flex flex-col gap-6">
            <Item variant="muted">
              <ItemContent>
                <ItemDescription>
                  Curated from verified customer feedback collected after completed appointments.
                </ItemDescription>
              </ItemContent>
            </Item>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.author} {...testimonial} />
              ))}
            </div>
          </div>
        </ItemContent>
      </Item>
    </MarketingSection>
  )
}
