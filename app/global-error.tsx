'use client'

import { useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Stack, Flex } from '@/components/layout/flex'
import { H2, P, Muted } from '@/components/ui/typography'
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
        <div className="flex min-h-screen items-center justify-center p-4 bg-background">
          <Card className="w-full max-w-lg border-destructive/50">
            <CardHeader>
              <Flex gap="sm" align="center">
                <ServerCrash className="h-6 w-6 text-destructive" />
                <H2 className="m-0">Critical Application Error</H2>
              </Flex>
            </CardHeader>

            <CardContent>
              <Stack gap="md">
                <P className="text-muted-foreground">
                  A critical error occurred that prevented the application from loading.
                  Please try refreshing the page. If the problem persists, contact support.
                </P>

                {error.digest && (
                  <Alert>
                    <AlertDescription>
                      <Muted className="font-mono text-xs">
                        Error ID: {error.digest}
                      </Muted>
                    </AlertDescription>
                  </Alert>
                )}

                {process.env.NODE_ENV === 'development' && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      <Stack gap="xs">
                        <Muted className="font-semibold text-xs">
                          Development Details:
                        </Muted>
                        <Muted className="font-mono text-xs break-all">
                          {error.message}
                        </Muted>
                      </Stack>
                    </AlertDescription>
                  </Alert>
                )}
              </Stack>
            </CardContent>

            <CardFooter>
              <Flex gap="sm" className="w-full">
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
              </Flex>
            </CardFooter>
          </Card>
        </div>
      </body>
    </html>
  )
}
