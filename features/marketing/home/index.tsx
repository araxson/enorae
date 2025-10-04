import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Section, Stack, Grid, Box } from '@/components/layout'
import { H1, H2, H3, Lead, P } from '@/components/ui/typography'
import { Calendar, Users, Sparkles, TrendingUp, Clock, Shield } from 'lucide-react'
import Link from 'next/link'

export function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Section size="xl" className="pt-20 pb-16 bg-gradient-to-b from-primary/5 to-background">
        <Stack gap="xl" className="max-w-4xl mx-auto text-center">
          <Stack gap="md">
            <H1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Enorae
            </H1>
            <Lead className="text-2xl md:text-3xl">
              Your Beauty Appointments, Simplified
            </Lead>
            <P className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The modern platform connecting clients with premier salons. Book appointments, manage your business, and grow your beauty brand.
            </P>
          </Stack>

          <Stack gap="sm" className="flex-row justify-center flex-wrap">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/explore">Find Salons</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link href="/signup">Get Started Free</Link>
            </Button>
          </Stack>
        </Stack>
      </Section>

      {/* Features Section */}
      <Section size="xl" className="py-16">
        <Stack gap="xl">
          <div className="text-center">
            <H2 className="text-3xl md:text-4xl font-bold">Everything You Need</H2>
            <P className="text-muted-foreground mt-4">
              Powerful features for clients and salon businesses
            </P>
          </div>

          <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Stack gap="md">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <H3>Easy Booking</H3>
                <P className="text-muted-foreground">
                  Find and book appointments at your favorite salons in seconds. Real-time availability and instant confirmations.
                </P>
              </Stack>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Stack gap="md">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <H3>Staff Management</H3>
                <P className="text-muted-foreground">
                  Manage your team, schedules, and services. Track performance and optimize your salon operations.
                </P>
              </Stack>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Stack gap="md">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <H3>Service Catalog</H3>
                <P className="text-muted-foreground">
                  Showcase your services with detailed descriptions, pricing, and duration. Let clients choose what&apos;s right for them.
                </P>
              </Stack>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Stack gap="md">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <H3>Business Analytics</H3>
                <P className="text-muted-foreground">
                  Track revenue, appointments, and performance. Make data-driven decisions to grow your business.
                </P>
              </Stack>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Stack gap="md">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <H3>Flexible Scheduling</H3>
                <P className="text-muted-foreground">
                  Set operating hours, block times, and manage staff availability. Full control over your calendar.
                </P>
              </Stack>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Stack gap="md">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <H3>Secure & Reliable</H3>
                <P className="text-muted-foreground">
                  Enterprise-grade security with role-based access control. Your data is safe and always available.
                </P>
              </Stack>
            </Card>
          </Grid>
        </Stack>
      </Section>

      {/* CTA Section */}
      <Section size="xl" className="py-16 bg-primary/5">
        <Box className="max-w-3xl mx-auto text-center">
          <Stack gap="xl">
            <Stack gap="md">
              <H2 className="text-3xl md:text-4xl font-bold">Ready to Get Started?</H2>
              <P className="text-lg text-muted-foreground">
                Join thousands of salons and clients using Enorae to streamline their beauty appointments
              </P>
            </Stack>

            <Stack gap="sm" className="flex-row justify-center flex-wrap">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/signup">Start Free Trial</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Section>
    </>
  )
}
