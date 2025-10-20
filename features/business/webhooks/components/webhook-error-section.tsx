import { Alert, AlertDescription } from '@/components/ui/alert'
import { Stack } from '@/components/layout'

type ErrorSectionProps = {
  error: string | null
}

export function WebhookErrorSection({ error }: ErrorSectionProps) {
  if (!error) return null

  return (
    <Stack gap="sm">
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Error</h4>
      <Alert variant="destructive" className="break-words">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    </Stack>
  )
}
