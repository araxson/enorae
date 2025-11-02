'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Globe, AlertCircle } from 'lucide-react'
import { updateAdvancedPreferences } from '@/features/shared/preferences/api/mutations'
import { TIME_MS } from '@/lib/config/constants'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { TimezoneField, LocaleField, CurrencyField } from './preference-field-sections'

interface AdvancedPreferences {
  timezone?: string | null
  locale?: string | null
  currency_code?: string | null
}

interface AdvancedPreferencesFormProps {
  initialPreferences?: AdvancedPreferences
}

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
      setTimeout(() => setSuccess(false), TIME_MS.SUCCESS_MESSAGE_TIMEOUT)
    } else {
      setError(result.error)
    }

    setIsLoading(false)
  }

  return (
    <Item variant="outline">
      <ItemHeader>
        <div className="flex items-center gap-2">
          <Globe className="size-5" aria-hidden="true" />
          <ItemTitle>Regional &amp; Display Preferences</ItemTitle>
        </div>
      </ItemHeader>
      <ItemContent>
        <ItemDescription>
          Customize your regional settings, language, and currency preferences
        </ItemDescription>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <TimezoneField preferences={preferences} setPreferences={setPreferences} />
            <LocaleField preferences={preferences} setPreferences={setPreferences} />
            <CurrencyField preferences={preferences} setPreferences={setPreferences} />

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertTitle>Update failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertCircle className="size-4" />
                <AlertTitle>Preferences saved</AlertTitle>
                <AlertDescription>Preferences updated successfully!</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Preferences</span>
              )}
            </Button>
          </div>
        </form>
      </ItemContent>
    </Item>
  )
}
