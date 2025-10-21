import { Shield } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function PrivacyNotice() {
  return (
    <Alert>
      <Shield className="h-4 w-4" />
      <AlertTitle>Privacy & Data</AlertTitle>
      <AlertDescription>
        Your preferences are stored securely and only used to improve your experience. You can update
        these settings at any time.
      </AlertDescription>
    </Alert>
  )
}
