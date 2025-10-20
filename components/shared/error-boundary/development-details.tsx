import { Alert, AlertDescription } from '@/components/ui/alert'
import { Stack } from '@/components/layout/flex'

export function DevelopmentDetails({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <AlertDescription>
        <Stack gap="xs">
          <p className="text-sm text-muted-foreground font-semibold text-xs">Development Details:</p>
          <p className="text-sm text-muted-foreground font-mono text-xs break-all">{message}</p>
        </Stack>
      </AlertDescription>
    </Alert>
  )
}
