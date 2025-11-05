'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface FormErrorSummaryProps {
  errors: Record<string, string[]>
  className?: string
}

export function FormErrorSummary({ errors, className }: FormErrorSummaryProps) {
  const errorEntries = Object.entries(errors).filter(([_, messages]) => messages && messages.length > 0)
  const errorCount = errorEntries.length

  if (errorCount === 0) return null

  return (
    <Alert variant="destructive" className={className} role="alert" aria-live="polite">
      <AlertCircle className="size-4" />
      <AlertTitle>Form has {errorCount} error{errorCount > 1 ? 's' : ''}</AlertTitle>
      <AlertDescription>
        <ul className="list-disc list-inside space-y-1">
          {errorEntries.map(([field, messages]) => (
            <li key={field}>
              <a
                href={`#${field}`}
                className="underline hover:no-underline focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 rounded"
              >
                {messages[0]}
              </a>
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  )
}
