'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Globe, DollarSign, Clock, AlertCircle } from 'lucide-react'
import { updateAdvancedPreferences } from '@/features/shared/preferences/api/mutations'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'

interface AdvancedPreferences {
  timezone?: string | null
  locale?: string | null
  currency_code?: string | null
}

interface AdvancedPreferencesFormProps {
  initialPreferences?: AdvancedPreferences
}

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT)' },
  { value: 'UTC', label: 'UTC' },
]

const LOCALES = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'es-ES', label: 'Spanish (Spain)' },
  { value: 'es-MX', label: 'Spanish (Mexico)' },
  { value: 'fr-FR', label: 'French' },
  { value: 'de-DE', label: 'German' },
  { value: 'it-IT', label: 'Italian' },
  { value: 'pt-BR', label: 'Portuguese (Brazil)' },
  { value: 'ja-JP', label: 'Japanese' },
  { value: 'ko-KR', label: 'Korean' },
  { value: 'zh-CN', label: 'Chinese (Simplified)' },
]

const CURRENCIES = [
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'CAD', label: 'Canadian Dollar ($)' },
  { value: 'AUD', label: 'Australian Dollar ($)' },
  { value: 'JPY', label: 'Japanese Yen (¥)' },
  { value: 'CNY', label: 'Chinese Yuan (¥)' },
  { value: 'INR', label: 'Indian Rupee (₹)' },
  { value: 'MXN', label: 'Mexican Peso ($)' },
  { value: 'BRL', label: 'Brazilian Real (R$)' },
]

export function AdvancedPreferencesForm({
  initialPreferences = {},
}: AdvancedPreferencesFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [preferences, setPreferences] = useState<AdvancedPreferences>({
    timezone: initialPreferences.timezone || 'America/New_York',
    locale: initialPreferences.locale || 'en-US',
    currency_code: initialPreferences.currency_code || 'USD',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const result = await updateAdvancedPreferences(preferences)

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
          <Globe className="h-5 w-5" />
          <CardTitle>Regional & Display Preferences</CardTitle>
        </div>
        <CardDescription>
          Customize your regional settings, language, and currency preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <Field>
              <FieldLabel htmlFor="timezone" className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
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

            <Field>
              <FieldLabel htmlFor="locale" className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
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

            <Field>
              <FieldLabel htmlFor="currency" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
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
              {isLoading ? (
                <>
                  <Spinner className="size-4" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Preferences</span>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
