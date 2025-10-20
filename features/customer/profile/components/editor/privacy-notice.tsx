import { Shield } from 'lucide-react'

export function PrivacyNotice() {
  return (
    <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
      <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
      <div className="space-y-1">
        <div className="text-xs font-medium text-muted-foreground">Privacy & Data</div>
        <div className="text-xs text-muted-foreground">
          Your preferences are stored securely and only used to improve your experience.
          You can update these settings at any time.
        </div>
      </div>
    </div>
  )
}
