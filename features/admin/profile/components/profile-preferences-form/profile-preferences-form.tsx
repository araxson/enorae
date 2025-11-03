'use client'

import { FormEvent, useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ButtonGroup } from '@/components/ui/button-group'
import { Spinner } from '@/components/ui/spinner'
import { Item, ItemActions, ItemContent, ItemGroup } from '@/components/ui/item'
import { updateProfilePreferencesAction, type ActionResponse } from '@/features/admin/profile/api/mutations'
import { RegionalFields } from './regional-fields'
import { NotificationToggles } from './notification-toggles'
import { usePreferencesState } from '../../hooks/use-preferences-state'
import type { ProfilePreferencesFormProps } from '../../api/types'

/**
 * Profile preferences form
 *
 * Allows updating:
 * - Regional settings (timezone, locale, country)
 * - Notification preferences (marketing emails, SMS alerts)
 */
export function ProfilePreferencesForm({ profile, onUpdated }: ProfilePreferencesFormProps) {
  const [state, setState] = usePreferencesState(profile)
  const [feedback, setFeedback] = useState<ActionResponse | null>(null)
  const [isPending, startTransition] = useTransition()

  if (!profile) {
    return null
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFeedback(null)

    startTransition(async () => {
      const payload = {
        profileId: profile.summary['id'],
        ...state,
      }

      const result = await updateProfilePreferencesAction(payload)
      setFeedback(result)

      if (result.success) {
        await onUpdated()
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="pb-2">
          <ItemGroup>
            <Item variant="muted">
              <ItemContent>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Adjust locale, timezone, and notification preferences.
                </CardDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <RegionalFields
            timezone={state.timezone}
            locale={state.locale}
            countryCode={state.countryCode}
            isPending={isPending}
            onTimezoneChange={(value) => setState((prev) => ({ ...prev, timezone: value }))}
            onLocaleChange={(value) => setState((prev) => ({ ...prev, locale: value }))}
            onCountryCodeChange={(value) => setState((prev) => ({ ...prev, countryCode: value }))}
          />

          <NotificationToggles
            marketingEmails={state.marketingEmails}
            smsAlerts={state.smsAlerts}
            isPending={isPending}
            onMarketingEmailsChange={(value) =>
              setState((prev) => ({ ...prev, marketingEmails: value }))
            }
            onSmsAlertsChange={(value) => setState((prev) => ({ ...prev, smsAlerts: value }))}
          />

          {feedback && (
            <Alert variant={feedback.success ? 'default' : 'destructive'}>
              <AlertTitle>{feedback.success ? 'Preferences updated' : 'Update failed'}</AlertTitle>
              <AlertDescription>{feedback.message}</AlertDescription>
            </Alert>
          )}

          <ItemGroup>
            <Item variant="muted">
              <ItemActions>
                <ButtonGroup>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Spinner className="mr-2" />
                        Saving…
                      </>
                    ) : (
                      'Save preferences'
                    )}
                  </Button>
                </ButtonGroup>
              </ItemActions>
            </Item>
          </ItemGroup>
        </form>
      </CardContent>
    </Card>
  )
}
