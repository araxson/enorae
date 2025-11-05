'use client'

import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface BookingErrorSummaryProps {
  errors?: Record<string, string[]>
}

export function BookingErrorSummary({ errors }: BookingErrorSummaryProps) {
  if (!errors || Object.keys(errors).length === 0) return null

  return (
    <Alert variant="destructive" role="alert" tabIndex={-1}>
      <AlertCircle className="size-4" />
      <AlertTitle>There are {Object.keys(errors).length} errors in the form</AlertTitle>
      <AlertDescription>
        <ul className="list-disc list-inside space-y-1 mt-2">
          {Object.entries(errors).map(([field, messages]) => (
            <li key={field}>
              <a
                href={`#${field}`}
                className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                {field === '_form' ? 'Form' : field}: {messages[0]}
              </a>
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  )
}
