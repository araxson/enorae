import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Calendar, Users, Sparkles, TrendingUp, Clock, Shield, Store, Award } from 'lucide-react'
import { TestimonialCard, StatBadge, TrustBadge } from '@/components/marketing'

export function HomePageClient() {
  return (
    <main className="space-y-0">
      <section className="bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-4 pb-16 pt-20 text-center sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-5xl font-bold leading-tight text-transparent md:text-6xl">
                Enorae
              </h1>
              <p className="text-xl text-muted-foreground text-2xl md:text-3xl">Your Beauty Appointments, Simplified</p>
              <p className="leading-7 mx-auto max-w-2xl text-lg text-muted-foreground">
                The modern platform connecting clients with premier salons. Book appointments, manage your business, and grow your beauty brand.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <TrustBadge type="verified" text="500+ Verified Salons" />
              <TrustBadge type="rated" text="4.8★ Average Rating" />
              <TrustBadge type="popular" text="10,000+ Happy Customers" />
              <TrustBadge type="secure" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="px-8 text-lg">
                <Link href="/explore">Find salons</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 text-lg">
                <Link href="/signup">Get started free</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 sm:px-6 lg:px-8">
          <StatBadge icon={Store} value="500+" label="Partner salons" color="primary" />
          <StatBadge icon={Users} value="10,000+" label="Active users" color="success" />
          <StatBadge icon={Calendar} value="50,000+" label="Bookings made" color="secondary" />
          <StatBadge icon={Award} value="4.8★" label="Average rating" color="warning" />
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight text-3xl font-bold md:text-4xl">Everything you need</h2>
            <p className="leading-7 mt-4 text-muted-foreground">Powerful features for clients and salon businesses</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Calendar,
                title: 'Easy booking',
                description:
                  'Find and book appointments at your favorite salons in seconds. Real-time availability and instant confirmations.',
              },
              {
                icon: Users,
                title: 'Staff management',
                description: 'Manage your team, schedules, and services. Track performance and optimize your salon operations.',
              },
              {
                icon: Sparkles,
                title: 'Service catalog',
                description:
                  "Showcase your services with detailed descriptions, pricing, and duration. Let clients choose what's right for them.",
              },
              {
                icon: TrendingUp,
                title: 'Business analytics',
                description:
                  'Track revenue, appointments, and performance. Make data-driven decisions to grow your business.',
              },
              {
                icon: Clock,
                title: 'Flexible scheduling',
                description:
                  'Set operating hours, block times, and manage staff availability. Full control over your calendar.',
              },
              {
                icon: Shield,
                title: 'Secure & reliable',
                description:
                  'Enterprise-grade security with role-based access control. Your data is safe and always available.',
              },
            ].map(({ icon: Icon, title, description }) => (
              <Card key={title} className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-xl font-semibold">{title}</h3>
                  <p className="leading-7 text-sm text-muted-foreground">{description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight text-3xl font-bold md:text-4xl">What our users say</h2>
            <p className="leading-7 mt-4 text-muted-foreground">Trusted by thousands of customers and salon professionals</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <TestimonialCard
              author="Sarah Johnson"
              role="Regular customer"
              content="Enorae makes booking so easy! I can find the perfect salon, book my appointment, and even reschedule if needed - all from my phone."
              rating={5}
            />
            <TestimonialCard
              author="Michael Chen"
              role="Salon owner, Luxe Hair Studio"
              content="Since using Enorae, our bookings have increased by 40%. The platform is intuitive and our clients love how easy it is to book appointments."
              rating={5}
            />
            <TestimonialCard
              author="Emily Rodriguez"
              role="Spa manager"
              content="The analytics dashboard helps us optimize our scheduling and staff allocation. It's been a game-changer for our operations."
              rating={5}
            />
          </div>
        </div>
      </section>

      <section className="bg-primary/5">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 lg:px-8">
          <div className="space-y-4">
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight text-3xl font-bold md:text-4xl">Ready to get started?</h2>
            <p className="leading-7 text-lg text-muted-foreground">
              Join thousands of salons and clients using Enorae to streamline their beauty appointments.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="px-8 text-lg">
              <Link href="/signup">Start free trial</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 text-lg">
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
