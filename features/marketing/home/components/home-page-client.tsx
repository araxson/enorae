import Link from 'next/link'
import {
  Calendar,
  Users,
  Sparkles,
  TrendingUp,
  Clock,
  Shield,
  Store,
  Award,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from '@/components/ui/button-group'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  MarketingHero,
  StatBadge,
  TestimonialCard,
  TrustBadge,
} from '@/features/marketing/common-components'

const stats = [
  { icon: Store, value: '500+', label: 'Partner salons' },
  { icon: Users, value: '10,000+', label: 'Active users' },
  { icon: Calendar, value: '50,000+', label: 'Bookings made' },
  { icon: Award, value: '4.8★', label: 'Average rating' },
]

const customerFeatures = [
  {
    icon: Calendar,
    title: 'Easy booking',
    description:
      'Find and book appointments in seconds with real-time availability and instant confirmations.',
  },
  {
    icon: Sparkles,
    title: 'Service discovery',
    description:
      'Browse curated service catalogs with pricing, duration, and detailed descriptions.',
  },
  {
    icon: Shield,
    title: 'Secure access',
    description:
      'Simple account creation with privacy controls and protected payment options.',
  },
]

const businessFeatures = [
  {
    icon: Users,
    title: 'Staff management',
    description:
      'Coordinate schedules, assign services, and track performance in one workspace.',
  },
  {
    icon: TrendingUp,
    title: 'Business analytics',
    description:
      'Monitor revenue, appointments, and trends to make data-driven decisions.',
  },
  {
    icon: Clock,
    title: 'Operating control',
    description:
      'Manage operating hours, block times, and automate reminders for every location.',
  },
]

const testimonials = [
  {
    author: 'Sarah Johnson',
    role: 'Regular customer',
    content:
      'Enorae makes booking so easy! I can find the perfect salon, book my appointment, and even reschedule if needed - all from my phone.',
    rating: 5,
  },
  {
    author: 'Michael Chen',
    role: 'Salon owner, Luxe Hair Studio',
    content:
      'Since using Enorae, our bookings have increased by 40%. The platform is intuitive and our clients love how easy it is to book appointments.',
    rating: 5,
  },
  {
    author: 'Emily Rodriguez',
    role: 'Spa manager',
    content:
      "The analytics dashboard helps us optimize our scheduling and staff allocation. It's been a game-changer for our operations.",
    rating: 5,
  },
]

export function HomePageClient() {
  return (
    <main className="flex flex-col gap-12 pb-16">
      <MarketingHero
        title="Enorae"
        subtitle="Your Beauty Appointments, Simplified"
        description="The modern platform connecting clients with premier salons. Book appointments, manage your business, and grow your beauty brand."
      >
        <div className="flex w-full flex-col items-center gap-6">
          <ButtonGroup className="flex flex-wrap justify-center gap-2 px-2">
            <Button asChild size="lg">
              <Link href="/explore">Find salons</Link>
            </Button>
            <ButtonGroupSeparator className="hidden sm:flex" />
            <Button asChild variant="outline" size="lg">
              <Link href="/signup">Get started free</Link>
            </Button>
          </ButtonGroup>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <TrustBadge type="verified" text="500+ Verified Salons" />
            <TrustBadge type="rated" text="4.8★ Average Rating" />
            <TrustBadge type="popular" text="10,000+ Happy Customers" />
            <TrustBadge type="secure" />
          </div>
        </div>
      </MarketingHero>

      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader className="items-center justify-center">
            <CardTitle>Trusted by beauty professionals</CardTitle>
            <CardDescription>Key platform metrics updated weekly</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <StatBadge key={stat.label} icon={stat.icon} value={stat.value} label={stat.label} />
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader className="items-center justify-center">
            <CardTitle>Everything you need</CardTitle>
            <CardDescription>Powerful tools for both clients and salon teams</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <Tabs defaultValue="customers" className="w-full">
              <TabsList className="justify-center">
                <TabsTrigger value="customers">For customers</TabsTrigger>
                <TabsTrigger value="business">For salons</TabsTrigger>
              </TabsList>
              <TabsContent value="customers" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {customerFeatures.map(({ icon: Icon, title, description }) => (
                    <Card key={title}>
                      <CardHeader className="flex flex-row items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>{title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{description}</CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="business" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {businessFeatures.map(({ icon: Icon, title, description }) => (
                    <Card key={title}>
                      <CardHeader className="flex flex-row items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>{title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{description}</CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>

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

      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Ready to get started?</EmptyTitle>
            <EmptyDescription>
              Join thousands of salons and clients using Enorae to streamline their beauty
              appointments.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <ButtonGroup className="w-full flex-col gap-2 sm:w-auto sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/signup">Start free trial</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/pricing">View pricing</Link>
              </Button>
            </ButtonGroup>
          </EmptyContent>
        </Empty>
      </section>
    </main>
  )
}
