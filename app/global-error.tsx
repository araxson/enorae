'use client'

import { useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ServerCrash, RefreshCw, Home } from 'lucide-react'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { ButtonGroup } from '@/components/ui/button-group'

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
            <CardHeader>
              <ItemGroup>
                <Item>
                  <ItemMedia variant="icon">
                    <ServerCrash className="size-6 text-destructive" aria-hidden="true" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Critical Application Error</ItemTitle>
                    <ItemDescription>Something went wrong while loading the app.</ItemDescription>
                  </ItemContent>
                </Item>
              </ItemGroup>
            </CardHeader>

            <CardContent className="space-y-6">
              <ItemGroup>
                <Item className="flex-col items-start gap-2">
                  <ItemContent>
                    <ItemDescription>
                      A critical error occurred that prevented the application from loading. Please try refreshing the page.
                      If the problem persists, contact support.
                    </ItemDescription>
                  </ItemContent>
                </Item>
              </ItemGroup>

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
              <ButtonGroup aria-label="Error actions">
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
                  <RefreshCw className="size-4" />
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
                  <Home className="size-4" />
                  Home
                </Button>
              </ButtonGroup>
            </CardFooter>
          </Card>
        </div>
      </body>
    </html>
  )
}
