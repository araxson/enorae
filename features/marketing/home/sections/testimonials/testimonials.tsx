import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TestimonialCard } from '@/features/marketing/common-components'

import { testimonials } from './testimonials.data'

export function Testimonials() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader className="items-center justify-center">
          <CardTitle>What our users say</CardTitle>
          <CardDescription>
            Trusted by thousands of customers and salon professionals
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.author} {...testimonial} />
          ))}
        </CardContent>
      </Card>
    </section>
  )
}
