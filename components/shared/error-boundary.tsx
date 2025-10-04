'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Section, Stack, Flex } from '@/components/layout'
import { H2, P, Muted } from '@/components/ui/typography'
import {
  AlertCircle,
  RefreshCw,
  Home,
  Copy,
  Check,
  WifiOff,
  ShieldAlert,
  ServerCrash
} from 'lucide-react'
import Link from 'next/link'

type ErrorType = 'network' | 'auth' | 'server' | 'client' | 'unknown'

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
  title?: string
  description?: string
  homeHref?: string
  homeLabel?: string
  showErrorDetails?: boolean
}

function detectErrorType(error: Error & { digest?: string }): ErrorType {
  const message = error.message.toLowerCase()

  if (message.includes('unauthorized') || message.includes('auth') || message.includes('permission')) {
    return 'auth'
  }
  if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
    return 'network'
  }
  if (message.includes('server') || message.includes('500') || message.includes('internal')) {
    return 'server'
  }
  if (error.digest) {
    return 'server'
  }

  return 'client'
}

function getErrorIcon(type: ErrorType) {
  switch (type) {
    case 'network':
      return <WifiOff className="h-5 w-5 text-destructive" />
    case 'auth':
      return <ShieldAlert className="h-5 w-5 text-destructive" />
    case 'server':
      return <ServerCrash className="h-5 w-5 text-destructive" />
    default:
      return <AlertCircle className="h-5 w-5 text-destructive" />
  }
}

function getErrorTitle(type: ErrorType, customTitle?: string): string {
  if (customTitle) return customTitle

  switch (type) {
    case 'network':
      return 'Connection Error'
    case 'auth':
      return 'Authentication Required'
    case 'server':
      return 'Server Error'
    default:
      return 'Something Went Wrong'
  }
}

function getErrorDescription(type: ErrorType, customDescription?: string): string {
  if (customDescription) return customDescription

  switch (type) {
    case 'network':
      return 'Unable to connect to the server. Please check your internet connection and try again.'
    case 'auth':
      return 'You need to be signed in to view this content. Please log in and try again.'
    case 'server':
      return 'Our servers encountered an issue. Our team has been notified and is working on a fix.'
    default:
      return 'An unexpected error occurred. Please try again or contact support if the problem persists.'
  }
}

export function ErrorBoundary({
  error,
  reset,
  title,
  description,
  homeHref = '/',
  homeLabel = 'Home',
  showErrorDetails = process.env.NODE_ENV === 'development',
}: ErrorBoundaryProps) {
  const [copied, setCopied] = useState(false)
  const errorType = detectErrorType(error)

  useEffect(() => {
    // Log error to console in development, error service in production
    console.error(`[${errorType.toUpperCase()}] Error:`, error)
  }, [error, errorType])

  const copyErrorDetails = async () => {
    const details = `Error Type: ${errorType}
Message: ${error.message}
${error.digest ? `Digest: ${error.digest}` : ''}
${error.stack ? `Stack: ${error.stack}` : ''}`

    await navigator.clipboard.writeText(details)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Section size="lg">
      <Stack gap="xl" className="items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-lg border-destructive/50">
          <CardHeader>
            <Flex gap="sm" align="center">
              {getErrorIcon(errorType)}
              <H2 className="m-0">{getErrorTitle(errorType, title)}</H2>
            </Flex>
          </CardHeader>

          <CardContent>
            <Stack gap="md">
              <P className="text-muted-foreground">
                {getErrorDescription(errorType, description)}
              </P>

              {error.digest && (
                <Alert>
                  <AlertDescription>
                    <Flex gap="sm" align="center" justify="between">
                      <Muted className="font-mono text-xs">
                        Error ID: {error.digest}
                      </Muted>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyErrorDetails}
                        className="h-7 gap-1"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3 w-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            Copy
                          </>
                        )}
                      </Button>
                    </Flex>
                  </AlertDescription>
                </Alert>
              )}

              {showErrorDetails && (
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
                onClick={reset}
                variant="default"
                className="flex-1 gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 gap-2"
              >
                <Link href={homeHref}>
                  <Home className="h-4 w-4" />
                  {homeLabel}
                </Link>
              </Button>
            </Flex>
          </CardFooter>
        </Card>
      </Stack>
    </Section>
  )
}
