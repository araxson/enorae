import { Alert, AlertDescription } from '@/components/ui/alert'
import { Muted } from '@/components/ui/typography'
import { Stack } from '@/components/layout/flex'

export function DevelopmentDetails({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <AlertDescription>
        <Stack gap="xs">
          <Muted className="font-semibold text-xs">Development Details:</Muted>
          <Muted className="font-mono text-xs break-all">{message}</Muted>
        </Stack>
      </AlertDescription>
    </Alert>
  )
}
