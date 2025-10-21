import { Alert, AlertDescription } from '@/components/ui/alert'
type ErrorSectionProps = {
  error: string | null
}

export function WebhookErrorSection({ error }: ErrorSectionProps) {
  if (!error) return null

  return (
    <div className="flex flex-col gap-3">
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Error</h4>
      <Alert variant="destructive" className="break-words">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    </div>
  )
}
