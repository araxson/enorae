'use client'

import { useState, useActionState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Globe, AlertCircle } from 'lucide-react'
import { updateAdvancedPreferencesAction } from '@/features/shared/preferences/api/actions'
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

interface FormState {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string[]>
  data?: unknown
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  return (
    <Button type="submit" disabled={disabled}>
      <span>Save Preferences</span>
    </Button>
  )
}

export function AdvancedPreferencesForm({
  initialPreferences = {},
}: AdvancedPreferencesFormProps) {
  const [preferences, setPreferences] = useState<AdvancedPreferences>({
    timezone: initialPreferences.timezone || 'America/New_York',
    locale: initialPreferences.locale || 'en-US',
    currency_code: initialPreferences.currency_code || 'USD',
  })

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    updateAdvancedPreferencesAction,
    {}
  )

  // Show success/error feedback
  useEffect(() => {
    if (state.success) {
      // Success message handled by Alert component
    }
  }, [state])

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
        <form action={formAction} aria-describedby={state.error ? 'form-error' : undefined}>
          {/* Screen reader announcement for form status */}
          <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
            {isPending && 'Form is submitting, please wait'}
            {state.success && 'Preferences saved successfully'}
          </div>

          {/* Hidden inputs for preference values */}
          <input type="hidden" name="timezone" value={preferences.timezone || ''} />
          <input type="hidden" name="locale" value={preferences.locale || ''} />
          <input type="hidden" name="currency_code" value={preferences.currency_code || ''} />

          <div className="flex flex-col gap-6">
            <TimezoneField preferences={preferences} setPreferences={setPreferences} disabled={isPending} />
            <LocaleField preferences={preferences} setPreferences={setPreferences} disabled={isPending} />
            <CurrencyField preferences={preferences} setPreferences={setPreferences} disabled={isPending} />

            {state.error && (
              <Alert variant="destructive" role="alert" id="form-error">
                <AlertCircle className="size-4" />
                <AlertTitle>Update failed</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            {state.success && (
              <Alert role="status">
                <AlertCircle className="size-4" />
                <AlertTitle>Preferences saved</AlertTitle>
                <AlertDescription>Preferences updated successfully!</AlertDescription>
              </Alert>
            )}

            <SubmitButton disabled={isPending} />
          </div>
        </form>
      </ItemContent>
    </Item>
  )
}
