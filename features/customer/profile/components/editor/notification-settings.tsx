import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Bell } from 'lucide-react'

interface NotificationSettingsProps {
  emailNotifications: boolean
  onEmailNotificationsChange: (value: boolean) => void
  smsNotifications: boolean
  onSmsNotificationsChange: (value: boolean) => void
  appointmentReminders: boolean
  onAppointmentRemindersChange: (value: boolean) => void
  marketingEmails: boolean
  onMarketingEmailsChange: (value: boolean) => void
}

export function NotificationSettings({
  emailNotifications,
  onEmailNotificationsChange,
  smsNotifications,
  onSmsNotificationsChange,
  appointmentReminders,
  onAppointmentRemindersChange,
  marketingEmails,
  onMarketingEmailsChange,
}: NotificationSettingsProps) {
  return (
    <div>
      <Label className="flex items-center gap-2 mb-4">
        <Bell className="h-4 w-4" />
        Notification Preferences
      </Label>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <small className="text-muted-foreground">Receive updates via email</small>
          </div>
          <Switch
            id="email-notifications"
            checked={emailNotifications}
            onCheckedChange={onEmailNotificationsChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="sms-notifications">SMS Notifications</Label>
            <small className="text-muted-foreground">Receive text message alerts</small>
          </div>
          <Switch
            id="sms-notifications"
            checked={smsNotifications}
            onCheckedChange={onSmsNotificationsChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="appointment-reminders">Appointment Reminders</Label>
            <small className="text-muted-foreground">Get reminders before appointments</small>
          </div>
          <Switch
            id="appointment-reminders"
            checked={appointmentReminders}
            onCheckedChange={onAppointmentRemindersChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="marketing-emails">Marketing Emails</Label>
            <small className="text-muted-foreground">Receive promotional offers and news</small>
          </div>
          <Switch
            id="marketing-emails"
            checked={marketingEmails}
            onCheckedChange={onMarketingEmailsChange}
          />
        </div>
      </div>
    </div>
  )
}
