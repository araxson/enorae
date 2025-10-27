'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Bell, Mail, MessageSquare, Smartphone } from 'lucide-react'
import { updateNotificationPreferences } from '@/features/shared/preferences/api/mutations'

interface NotificationPreferences {
  email_appointments?: boolean
  email_promotions?: boolean
  sms_reminders?: boolean
  push_enabled?: boolean
}

interface NotificationPreferencesFormProps {
  initialPreferences?: NotificationPreferences
}

export function NotificationPreferencesForm({
  initialPreferences = {},
}: NotificationPreferencesFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_appointments: initialPreferences.email_appointments ?? true,
    email_promotions: initialPreferences.email_promotions ?? false,
    sms_reminders: initialPreferences.sms_reminders ?? true,
    push_enabled: initialPreferences.push_enabled ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const result = await updateNotificationPreferences(preferences)

    if (result.success) {
      setSuccess(true)
      router.refresh()
      const SUCCESS_MESSAGE_TIMEOUT = 3000 // 3 seconds
      setTimeout(() => setSuccess(false), SUCCESS_MESSAGE_TIMEOUT)
    } else {
      setError(result.error)
    }

    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <CardTitle>Notification preferences</CardTitle>
        </div>
        <CardDescription>
          Manage how you receive notifications and updates from Enorae
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Notifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Email notifications</h3>
            </div>

            <div className="space-y-4 pl-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email_appointments">Appointment updates</Label>
                  <CardDescription>
                    Confirmations, reminders, and cancellations
                  </CardDescription>
                </div>
                <Switch
                  id="email_appointments"
                  checked={preferences.email_appointments}
                  onCheckedChange={(checked) =>
                    setPreferences((prev) => ({ ...prev, email_appointments: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email_promotions">Promotions and offers</Label>
                  <CardDescription>
                    Special deals and salon updates
                  </CardDescription>
                </div>
                <Switch
                  id="email_promotions"
                  checked={preferences.email_promotions}
                  onCheckedChange={(checked) =>
                    setPreferences((prev) => ({ ...prev, email_promotions: checked }))
                  }
                />
              </div>
            </div>
          </div>

          {/* SMS Notifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">SMS notifications</h3>
            </div>

            <div className="space-y-4 pl-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms_reminders">Appointment reminders</Label>
                  <CardDescription>
                    Get SMS reminders before your appointments
                  </CardDescription>
                </div>
                <Switch
                  id="sms_reminders"
                  checked={preferences.sms_reminders}
                  onCheckedChange={(checked) =>
                    setPreferences((prev) => ({ ...prev, sms_reminders: checked }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Push Notifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Push notifications</h3>
            </div>

            <div className="space-y-4 pl-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push_enabled">Enable push notifications</Label>
                  <CardDescription>
                    Receive real-time updates on your device
                  </CardDescription>
                </div>
                <Switch
                  id="push_enabled"
                  checked={preferences.push_enabled}
                  onCheckedChange={(checked) =>
                    setPreferences((prev) => ({ ...prev, push_enabled: checked }))
                  }
                />
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Update failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Preferences saved</AlertTitle>
              <AlertDescription>Preferences updated successfully!</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save preferences'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
