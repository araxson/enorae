import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type OperatingHoursErrorProps = {
  error: unknown
}

export function OperatingHoursError({ error }: OperatingHoursErrorProps) {
  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <Alert>
        <AlertTitle>Failed to load data</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : 'Failed to load salon data'}
        </AlertDescription>
      </Alert>
    </section>
  )
}
