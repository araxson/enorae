import { Alert, AlertDescription } from '@/components/ui/alert'

export function DevelopmentDetails({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <AlertDescription>
        <div className="flex flex-col gap-6">
          <p>Development Details:</p>
          <p className="font-mono break-all">{message}</p>
        </div>
      </AlertDescription>
    </Alert>
  )
}
