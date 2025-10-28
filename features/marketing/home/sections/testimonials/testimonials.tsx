import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Item, ItemContent, ItemDescription } from '@/components/ui/item'
import { MarketingSection, TestimonialCard } from '@/features/marketing/common-components'

import { testimonials } from './testimonials.data'

export function Testimonials() {
  return (
    <MarketingSection spacing="compact" groupClassName="gap-0">
      <Card>
        <CardHeader>
          <div className="flex flex-col items-center text-center">
            <CardTitle>What our users say</CardTitle>
            <CardDescription>
              Trusted by thousands of customers and salon professionals
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </MarketingSection>
  )
}
