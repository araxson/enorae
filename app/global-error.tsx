'use client'

import { useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ServerCrash, RefreshCw, Home } from 'lucide-react'

/**
 * Global Error Boundary
 *
 * Catches errors in the root layout. Must be a minimal implementation
 * as it renders in place of the root layout (no providers available).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  const [isNavigating, startNavigation] = useTransition()

  useEffect(() => {
    console.error('[CRITICAL] Root layout error:', error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <Card className="w-full max-w-lg border-destructive/50">
            <CardHeader className="flex items-center gap-4">
              <ServerCrash className="h-6 w-6 text-destructive" aria-hidden="true" />
              <CardTitle>Critical Application Error</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <CardDescription>
                A critical error occurred that prevented the application from loading. Please try refreshing the page.
                If the problem persists, contact support.
              </CardDescription>

              {error.digest && (
                <Alert>
                  <AlertTitle>Error ID</AlertTitle>
                  <AlertDescription>
                    <code className="block whitespace-pre-wrap break-words text-muted-foreground">
                      {error.digest}
                    </code>
                  </AlertDescription>
                </Alert>
              )}

              {process.env.NODE_ENV === 'development' && (
                <Alert variant="destructive">
                  <AlertTitle>Development details</AlertTitle>
                  <AlertDescription>
                    <code className="block whitespace-pre-wrap break-words text-muted-foreground">
                      {error.message}
                    </code>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>

            <CardFooter>
              <div className="flex w-full gap-6">
                <Button
                  onClick={() => {
                    startNavigation(async () => {
                      await Promise.resolve(reset())
                    })
                  }}
                  variant="default"
                  className="flex-1 gap-2"
                  disabled={isNavigating}
                  aria-busy={isNavigating}
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                <Button
                  onClick={() => {
                    startNavigation(() => {
                      router.replace('/')
                      router.refresh()
                    })
                  }}
                  variant="outline"
                  className="flex-1 gap-2"
                  disabled={isNavigating}
                  aria-busy={isNavigating}
                >
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </body>
    </html>
  )
}
