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
      <div className="flex items-center gap-2 mb-4">
        <Bell className="h-4 w-4" />
        <h3>Notification Preferences</h3>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <p>Receive updates via email</p>
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
            <p>Receive text message alerts</p>
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
            <p>Get reminders before appointments</p>
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
            <p>Receive promotional offers and news</p>
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
