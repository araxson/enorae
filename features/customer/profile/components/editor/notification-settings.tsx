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
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

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
      <div className="mb-4">
        <ItemGroup>
          <Item variant="muted" size="sm">
            <ItemMedia variant="icon">
              <Bell className="size-4" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Notification Preferences</ItemTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </div>
      <FieldSet>
        <FieldLegend className="sr-only">Notification preferences</FieldLegend>
        <FieldGroup>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="email-notifications">Email notifications</FieldLabel>
              <FieldDescription>Receive updates via email</FieldDescription>
            </FieldContent>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={onEmailNotificationsChange}
            />
          </Field>

          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="sms-notifications">SMS notifications</FieldLabel>
              <FieldDescription>Receive text message alerts</FieldDescription>
            </FieldContent>
            <Switch
              id="sms-notifications"
              checked={smsNotifications}
              onCheckedChange={onSmsNotificationsChange}
            />
          </Field>

          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="appointment-reminders">Appointment reminders</FieldLabel>
              <FieldDescription>Get reminders before appointments</FieldDescription>
            </FieldContent>
            <Switch
              id="appointment-reminders"
              checked={appointmentReminders}
              onCheckedChange={onAppointmentRemindersChange}
            />
          </Field>

          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="marketing-emails">Marketing emails</FieldLabel>
              <FieldDescription>Receive promotional offers and news</FieldDescription>
            </FieldContent>
            <Switch
              id="marketing-emails"
              checked={marketingEmails}
              onCheckedChange={onMarketingEmailsChange}
            />
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  )
}
