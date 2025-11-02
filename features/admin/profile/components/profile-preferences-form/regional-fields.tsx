'use client'

import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'

interface RegionalFieldsProps {
  timezone: string
  locale: string
  countryCode: string
  isPending: boolean
  onTimezoneChange: (value: string) => void
  onLocaleChange: (value: string) => void
  onCountryCodeChange: (value: string) => void
}

/**
 * Regional settings fields (timezone, locale, country)
 */
export function RegionalFields({
  timezone,
  locale,
  countryCode,
  isPending,
  onTimezoneChange,
  onLocaleChange,
  onCountryCodeChange,
}: RegionalFieldsProps) {
  return (
    <FieldSet>
      <FieldLegend variant="label">Regional settings</FieldLegend>
      <FieldGroup className="gap-4 sm:grid sm:grid-cols-3">
        <Field>
          <FieldLabel htmlFor="admin-profile-timezone">Timezone</FieldLabel>
          <FieldContent>
            <Input
              id="admin-profile-timezone"
              value={timezone}
              onChange={(event) => onTimezoneChange(event.target.value)}
              placeholder="America/Los_Angeles"
              disabled={isPending}
            />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="admin-profile-locale">Locale</FieldLabel>
          <FieldContent>
            <Input
              id="admin-profile-locale"
              value={locale}
              onChange={(event) => onLocaleChange(event.target.value)}
              placeholder="en-US"
              disabled={isPending}
            />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="admin-profile-country">Country code</FieldLabel>
          <FieldContent>
            <Input
              id="admin-profile-country"
              value={countryCode}
              onChange={(event) => onCountryCodeChange(event.target.value.toUpperCase())}
              placeholder="US"
              maxLength={2}
              disabled={isPending}
            />
            <FieldDescription>Use ISO-3166 alpha-2.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
