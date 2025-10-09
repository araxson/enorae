import { Alert, AlertDescription } from '@/components/ui/alert'
import { H4 } from '@/components/ui/typography'
import { Stack } from '@/components/layout'

type ErrorSectionProps = {
  error: string | null
}

export function WebhookErrorSection({ error }: ErrorSectionProps) {
  if (!error) return null

  return (
    <Stack gap="sm">
      <H4>Error</H4>
      <Alert variant="destructive">
        <AlertDescription className="break-words">{error}</AlertDescription>
      </Alert>
    </Stack>
  )
}
