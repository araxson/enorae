'use client'

import { Dispatch, SetStateAction } from 'react'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Shield } from 'lucide-react'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'

interface NotificationsPreferencesTabProps {
  emailNotifications: boolean
  setEmailNotifications: Dispatch<SetStateAction<boolean>>
  smsNotifications: boolean
  setSmsNotifications: Dispatch<SetStateAction<boolean>>
  appointmentReminders: boolean
  setAppointmentReminders: Dispatch<SetStateAction<boolean>>
  marketingEmails: boolean
  setMarketingEmails: Dispatch<SetStateAction<boolean>>
}

export function NotificationsPreferencesTab({
  emailNotifications,
  setEmailNotifications,
  smsNotifications,
  setSmsNotifications,
  appointmentReminders,
  setAppointmentReminders,
  marketingEmails,
  setMarketingEmails,
}: NotificationsPreferencesTabProps) {
  return (
    <div className="space-y-4">
      <FieldSet>
        <FieldLegend>Notification preferences</FieldLegend>
        <FieldGroup>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="email-notifications">Email notifications</FieldLabel>
              <FieldDescription>Receive updates via email</FieldDescription>
            </FieldContent>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
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
              onCheckedChange={setSmsNotifications}
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
              onCheckedChange={setAppointmentReminders}
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
              onCheckedChange={setMarketingEmails}
            />
          </Field>
        </FieldGroup>
      </FieldSet>

      <Alert>
        <Shield className="size-4" />
        <AlertTitle>Privacy &amp; Data</AlertTitle>
        <AlertDescription>
          Your preferences are stored securely and only used to improve your experience. You can
          update these settings at any time.
        </AlertDescription>
      </Alert>
    </div>
  )
}
