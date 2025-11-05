'use client'

interface LocationFormStatusProps {
  isPending: boolean
  success?: boolean
  error?: string
  errors?: Record<string, string[]>
}

export function LocationFormStatus({ isPending, success, error, errors }: LocationFormStatusProps) {
  const hasErrors = errors && Object.keys(errors).length > 0

  return (
    <>
      {/* Screen reader announcement */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isPending && 'Form is submitting, please wait'}
        {error && !isPending && error}
        {success && 'Location saved successfully'}
      </div>

      {/* Error summary */}
      {hasErrors && (
        <div
          role="alert"
          className="rounded-md bg-destructive/10 border border-destructive p-3 mb-4"
        >
          <h3 className="text-sm font-medium text-destructive mb-2">
            Please fix the following errors:
          </h3>
          <ul className="text-sm text-destructive list-disc list-inside">
            {Object.entries(errors).map(([field, messages]) => (
              <li key={field}>
                <a href={`#${field}`} className="underline hover:text-destructive/80">
                  {field}: {messages[0]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Global error */}
      {error && !hasErrors && (
        <div
          role="alert"
          className="rounded-md bg-destructive/10 border border-destructive p-3 mb-4 text-sm text-destructive"
        >
          {error}
        </div>
      )}
    </>
  )
}
