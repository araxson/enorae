import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Section, Stack, Group, Center, Box } from '@/components/layout'
import { H1, Lead, Muted } from '@/components/ui/typography'
import Link from 'next/link'

export function HomePage() {
  return (
    <Section size="lg" className="min-h-screen">
      <Center className="h-full">
        <Card className="max-w-2xl">
          <CardContent>
            <Box pt="md">
              <Stack gap="xl" className="text-center">
                <Stack gap="md">
                  <H1>Enorae</H1>
                  <Lead>Modern Salon Booking Platform</Lead>
                  <Muted>
                    Built with Next.js 15, React 19, TypeScript, and Supabase
                  </Muted>
                </Stack>

                <Group gap="md" className="justify-center">
                  <Button asChild size="lg">
                    <Link href="/explore">Browse Salons</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/business">Business Dashboard</Link>
                  </Button>
                </Group>

                <Box pt="md" className="border-t">
                  <Muted>
                    <strong>Tech Stack:</strong> Next.js 15.5.4 • React 19.1.0 • TypeScript 5.6 • Supabase • Tailwind CSS 4
                  </Muted>
                </Box>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Center>
    </Section>
  )
}
