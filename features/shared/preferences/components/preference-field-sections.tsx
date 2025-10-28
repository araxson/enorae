'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Globe, DollarSign, Clock } from 'lucide-react'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import { TIMEZONES, LOCALES, CURRENCIES } from './preference-constants'

interface AdvancedPreferences {
  timezone?: string | null
  locale?: string | null
  currency_code?: string | null
}

interface PreferenceFieldProps {
  preferences: AdvancedPreferences
  setPreferences: React.Dispatch<React.SetStateAction<AdvancedPreferences>>
}

export function TimezoneField({ preferences, setPreferences }: PreferenceFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="timezone" className="flex items-center gap-2">
        <Clock className="size-4 text-muted-foreground" aria-hidden="true" />
        Timezone
      </FieldLabel>
      <FieldContent>
        <Select
          value={preferences.timezone || undefined}
          onValueChange={(value) =>
            setPreferences((prev) => ({ ...prev, timezone: value }))
          }
        >
          <SelectTrigger id="timezone">
            <SelectValue placeholder="Select timezone" />
          </SelectTrigger>
          <SelectContent>
            {TIMEZONES.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldDescription>
          Appointments and times will be displayed in your selected timezone
        </FieldDescription>
      </FieldContent>
    </Field>
  )
}

export function LocaleField({ preferences, setPreferences }: PreferenceFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="locale" className="flex items-center gap-2">
        <Globe className="size-4 text-muted-foreground" aria-hidden="true" />
        Language &amp; Region
      </FieldLabel>
      <FieldContent>
        <Select
          value={preferences.locale || undefined}
          onValueChange={(value) =>
            setPreferences((prev) => ({ ...prev, locale: value }))
          }
        >
          <SelectTrigger id="locale">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {LOCALES.map((locale) => (
              <SelectItem key={locale.value} value={locale.value}>
                {locale.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldDescription>
          Affects date formats, number formats, and interface language
        </FieldDescription>
      </FieldContent>
    </Field>
  )
}

export function CurrencyField({ preferences, setPreferences }: PreferenceFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="currency" className="flex items-center gap-2">
        <DollarSign className="size-4 text-muted-foreground" aria-hidden="true" />
        Currency
      </FieldLabel>
      <FieldContent>
        <Select
          value={preferences.currency_code || undefined}
          onValueChange={(value) =>
            setPreferences((prev) => ({ ...prev, currency_code: value }))
          }
        >
          <SelectTrigger id="currency">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map((currency) => (
              <SelectItem key={currency.value} value={currency.value}>
                {currency.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldDescription>
          Prices and amounts will be displayed in your selected currency
        </FieldDescription>
      </FieldContent>
    </Field>
  )
}
