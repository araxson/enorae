import { Alert, AlertDescription } from '@/components/ui/alert'

export function DevelopmentDetails({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <AlertDescription>
        <div className="flex flex-col gap-6">
          <p className="text-sm text-muted-foreground font-semibold text-xs">Development Details:</p>
          <p className="text-sm text-muted-foreground font-mono text-xs break-all">{message}</p>
        </div>
      </AlertDescription>
    </Alert>
  )
}
