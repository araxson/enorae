import { ItemDescription } from '@/components/ui/item'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { MarketingPanel, MarketingSection, TestimonialCard } from '@/features/marketing/components/common'

import { testimonials } from './testimonials.data'

export function Testimonials() {
  return (
    <MarketingSection spacing="compact" groupClassName="gap-0">
      <MarketingPanel
        align="center"
        title="What our users say"
        description="Trusted by thousands of customers and salon professionals"
      >
        <ItemDescription>
          Curated from verified customer feedback collected after completed appointments.
        </ItemDescription>
        <Carousel className="w-full" opts={{ align: 'start' }}>
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.author} className="md:basis-1/2 lg:basis-1/3">
                <TestimonialCard {...testimonial} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </MarketingPanel>
    </MarketingSection>
  )
}
