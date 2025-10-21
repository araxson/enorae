'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { DigestInfo } from './digest-info'
import { DevelopmentDetails } from './development-details'
import { ErrorBoundaryActions } from './actions'
import { detectErrorType, ERROR_DESCRIPTIONS, ERROR_TITLES, getErrorIcon } from './utils'

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
  title?: string
  description?: string
  homeHref?: string
  homeLabel?: string
  showErrorDetails?: boolean
}

const DEFAULT_HOME_LINK = '/'
const DEFAULT_HOME_LABEL = 'Home'

export function ErrorBoundary({
  error,
  reset,
  title,
  description,
  homeHref = DEFAULT_HOME_LINK,
  homeLabel = DEFAULT_HOME_LABEL,
  showErrorDetails = process.env.NODE_ENV === 'development',
}: ErrorBoundaryProps) {
  const errorType = detectErrorType(error)

  useEffect(() => {
    console.error(`[${errorType.toUpperCase()}] Error:`, error)
  }, [error, errorType])

  const copyDetails = `Error Type: ${errorType}\nMessage: ${error.message}\n${error.digest ? `Digest: ${error.digest}` : ''}\n${error.stack ? `Stack: ${error.stack}` : ''}`

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto flex min-h-[60vh] w-full max-w-6xl flex-col items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-lg border-destructive/50">
          <CardHeader>
            <div className="flex gap-6">
              {getErrorIcon(errorType)}
              <h2 className="m-0 scroll-m-20 text-3xl font-semibold tracking-tight">
                {title ?? ERROR_TITLES[errorType]}
              </h2>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-6">
              <p className="leading-7 text-muted-foreground">
                {description ?? ERROR_DESCRIPTIONS[errorType]}
              </p>

              {error.digest && <DigestInfo digest={error.digest} details={copyDetails} />}

              {showErrorDetails && <DevelopmentDetails message={error.message} />}
            </div>
          </CardContent>

          <CardFooter>
            <ErrorBoundaryActions reset={reset} homeHref={homeHref} homeLabel={homeLabel} isLoading={false} />
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}
