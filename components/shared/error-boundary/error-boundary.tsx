'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Section } from '@/components/layout/primitives'
import { Stack, Flex } from '@/components/layout/flex'
import { H2, P } from '@/components/ui/typography'
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
    <Section size="lg">
      <Stack gap="xl" className="items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-lg border-destructive/50">
          <CardHeader>
            <Flex gap="sm" align="center">
              {getErrorIcon(errorType)}
              <H2 className="m-0">{title ?? ERROR_TITLES[errorType]}</H2>
            </Flex>
          </CardHeader>

          <CardContent>
            <Stack gap="md">
              <P className="text-muted-foreground">
                {description ?? ERROR_DESCRIPTIONS[errorType]}
              </P>

              {error.digest && <DigestInfo digest={error.digest} details={copyDetails} />}

              {showErrorDetails && <DevelopmentDetails message={error.message} />}
            </Stack>
          </CardContent>

          <CardFooter>
            <ErrorBoundaryActions reset={reset} homeHref={homeHref} homeLabel={homeLabel} isLoading={false} />
          </CardFooter>
        </Card>
      </Stack>
    </Section>
  )
}
