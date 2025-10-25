import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
type ErrorSectionProps = {
  error: string | null
}

export function WebhookErrorSection({ error }: ErrorSectionProps) {
  if (!error) return null

  return (
    <Alert variant="destructive" className="break-words">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )
}
