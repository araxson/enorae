'use client'

import { Dispatch, SetStateAction } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DollarSign } from 'lucide-react'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'

interface RegionalPreferencesTabProps {
  timezone: string
  setTimezone: Dispatch<SetStateAction<string>>
  locale: string
  setLocale: Dispatch<SetStateAction<string>>
  currencyCode: string
  setCurrencyCode: Dispatch<SetStateAction<string>>
}

export function RegionalPreferencesTab({
  timezone,
  setTimezone,
  locale,
  setLocale,
  currencyCode,
  setCurrencyCode,
}: RegionalPreferencesTabProps) {
  return (
    <FieldSet>
      <FieldLegend>Regional defaults</FieldLegend>
      <FieldGroup className="gap-4">
        <Field>
          <FieldLabel htmlFor="timezone">Timezone</FieldLabel>
          <FieldContent>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger id="timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                <SelectItem value="Europe/London">London (GMT)</SelectItem>
                <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="locale">Language</FieldLabel>
          <FieldContent>
            <Select value={locale} onValueChange={setLocale}>
              <SelectTrigger id="locale">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="en-GB">English (UK)</SelectItem>
                <SelectItem value="es-ES">Spanish</SelectItem>
                <SelectItem value="fr-FR">French</SelectItem>
                <SelectItem value="de-DE">German</SelectItem>
                <SelectItem value="ja-JP">Japanese</SelectItem>
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="currency">
            <span className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Currency
            </span>
          </FieldLabel>
          <FieldContent>
            <Select value={currencyCode} onValueChange={setCurrencyCode}>
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="JPY">JPY (¥)</SelectItem>
                <SelectItem value="CAD">CAD ($)</SelectItem>
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
