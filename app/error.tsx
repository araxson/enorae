'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Section, Stack } from '@/components/layout'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <Section size="lg">
      <Stack gap="xl" className="items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle>Something went wrong</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Stack gap="sm">
              <p className="text-sm text-muted-foreground">
                An unexpected error occurred. Please try again.
              </p>
              {error.digest && (
                <p className="text-xs text-muted-foreground font-mono">
                  Error ID: {error.digest}
                </p>
              )}
            </Stack>
          </CardContent>
          <CardFooter>
            <Button onClick={() => reset()} className="w-full">
              Try again
            </Button>
          </CardFooter>
        </Card>
      </Stack>
    </Section>
  )
}
