'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type StatusMessagesProps = {
  approveState: {
    success?: boolean
    error?: string
    message?: string
  } | null
  rejectState: {
    success?: boolean
    error?: string
    message?: string
  } | null
}

export function StatusMessages({ approveState, rejectState }: StatusMessagesProps) {
  return (
    <>
      {approveState?.success && (
        <Alert>
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{approveState.message}</AlertDescription>
        </Alert>
      )}

      {approveState?.error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{approveState.error}</AlertDescription>
        </Alert>
      )}

      {rejectState?.success && (
        <Alert>
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{rejectState.message}</AlertDescription>
        </Alert>
      )}

      {rejectState?.error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{rejectState.error}</AlertDescription>
        </Alert>
      )}
    </>
  )
}
