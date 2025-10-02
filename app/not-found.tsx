import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Section, Stack } from '@/components/layout'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <Section size="lg">
      <Stack gap="xl" className="items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-6xl font-bold">404</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack gap="sm">
              <h2 className="text-2xl font-semibold">Page Not Found</h2>
              <p className="text-sm text-muted-foreground">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
              </p>
            </Stack>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button asChild className="flex-1">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/salons">
                <Search className="mr-2 h-4 w-4" />
                Explore
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </Stack>
    </Section>
  )
}
