'use client'

type FormErrorSummaryProps = {
  errors: Record<string, string[]>
}

export function FormErrorSummary({ errors }: FormErrorSummaryProps) {
  const errorCount = Object.keys(errors).length

  if (errorCount === 0) return null

  return (
    <div
      role="alert"
      className="bg-destructive/10 border border-destructive p-4 rounded-md"
      tabIndex={-1}
    >
      <h2 className="font-semibold text-destructive mb-2">
        There are {errorCount} errors in the form
      </h2>
      <ul className="list-disc list-inside space-y-1">
        {Object.entries(errors).map(([field, messages]) => (
          <li key={field}>
            <a
              href={`#${field}`}
              className="text-destructive underline hover:no-underline"
            >
              {field}: {messages[0]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
