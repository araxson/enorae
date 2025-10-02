'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Section, Stack } from '@/components/layout'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Customer portal error:', error)
  }, [error])

  return (
    <Section size="lg">
      <Stack gap="xl" className="items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle>Unable to Load Content</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Stack gap="sm">
              <p className="text-sm text-muted-foreground">
                We couldn&apos;t load this page. This might be due to a connection issue or the content may no longer be available.
              </p>
            </Stack>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button onClick={() => reset()} variant="outline" className="flex-1">
              Try again
            </Button>
            <Button asChild className="flex-1">
              <Link href="/salons">Browse Salons</Link>
            </Button>
          </CardFooter>
        </Card>
      </Stack>
    </Section>
  )
}
