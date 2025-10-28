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
        <FieldGroup className="gap-4">
          <Field orientation="responsive">
            <FieldLabel htmlFor="email-notifications">Email notifications</FieldLabel>
            <FieldContent className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <FieldDescription>Receive updates via email</FieldDescription>
              <Switch
                className="sm:ml-4"
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
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
                onCheckedChange={setSmsNotifications}
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
                onCheckedChange={setAppointmentReminders}
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
                onCheckedChange={setMarketingEmails}
              />
            </FieldContent>
          </Field>
        </FieldGroup>
      </FieldSet>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertTitle>Privacy &amp; Data</AlertTitle>
        <AlertDescription>
          Your preferences are stored securely and only used to improve your experience. You can
          update these settings at any time.
        </AlertDescription>
      </Alert>
    </div>
  )
}
