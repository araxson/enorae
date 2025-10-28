import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function CustomerProfileAuthError() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <Alert variant="destructive">
        <AlertTitle>Authentication required</AlertTitle>
        <AlertDescription>Please log in to view your profile.</AlertDescription>
      </Alert>
    </div>
  )
}
