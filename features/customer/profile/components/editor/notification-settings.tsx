import { Switch } from '@/components/ui/switch'
import { Bell } from 'lucide-react'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'

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
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Notification Preferences</h3>
      </div>
      <FieldSet>
        <FieldLegend className="sr-only">Notification preferences</FieldLegend>
        <FieldGroup className="gap-4">
          <Field orientation="responsive">
            <FieldLabel htmlFor="email-notifications">Email notifications</FieldLabel>
            <FieldContent className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <FieldDescription>Receive updates via email</FieldDescription>
              <Switch
                className="sm:ml-4"
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={onEmailNotificationsChange}
              />
            </FieldContent>
          </Field>

          <Field orientation="responsive">
            <FieldLabel htmlFor="sms-notifications">SMS notifications</FieldLabel>
            <FieldContent className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <FieldDescription>Receive text message alerts</FieldDescription>
              <Switch
                className="sm:ml-4"
                id="sms-notifications"
                checked={smsNotifications}
                onCheckedChange={onSmsNotificationsChange}
              />
            </FieldContent>
          </Field>

          <Field orientation="responsive">
            <FieldLabel htmlFor="appointment-reminders">Appointment reminders</FieldLabel>
            <FieldContent className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <FieldDescription>Get reminders before appointments</FieldDescription>
              <Switch
                className="sm:ml-4"
                id="appointment-reminders"
                checked={appointmentReminders}
                onCheckedChange={onAppointmentRemindersChange}
              />
            </FieldContent>
          </Field>

          <Field orientation="responsive">
            <FieldLabel htmlFor="marketing-emails">Marketing emails</FieldLabel>
            <FieldContent className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <FieldDescription>Receive promotional offers and news</FieldDescription>
              <Switch
                className="sm:ml-4"
                id="marketing-emails"
                checked={marketingEmails}
                onCheckedChange={onMarketingEmailsChange}
              />
            </FieldContent>
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  )
}
