'use client'

import { FormEvent, useEffect, useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { ProfileDetail } from '../api/types'
import { updateProfilePreferencesAction, type ActionResponse } from '../api/mutations'

interface ProfilePreferencesFormProps {
  profile: ProfileDetail | null
  onUpdated: () => Promise<void>
}

const initialState: ActionResponse | null = null

export function ProfilePreferencesForm({ profile, onUpdated }: ProfilePreferencesFormProps) {
  const [timezone, setTimezone] = useState('')
  const [locale, setLocale] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [smsAlerts, setSmsAlerts] = useState(false)
  const [feedback, setFeedback] = useState<ActionResponse | null>(initialState)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!profile) return
    setTimezone(profile.preferences.timezone ?? profile.summary.timezone ?? '')
    setLocale(profile.preferences.locale ?? profile.summary.locale ?? '')
    setCountryCode(profile.preferences.countryCode ?? profile.summary.countryCode ?? '')

    const prefs = profile.preferences.preferences
    setMarketingEmails(Boolean(prefs?.marketingEmails))
    setSmsAlerts(Boolean(prefs?.smsAlerts))
    setFeedback(initialState)
  }, [profile])

  if (!profile) {
    return null
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFeedback(initialState)

    startTransition(async () => {
      const payload = {
        profileId: profile.summary.id,
        timezone,
        locale,
        countryCode,
        marketingEmails,
        smsAlerts,
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
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Preferences</CardTitle>
        <CardDescription>Adjust locale, timezone, and notification preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="admin-profile-timezone" className="text-sm font-medium">
                Timezone
              </label>
              <Input
                id="admin-profile-timezone"
                value={timezone}
                onChange={(event) => setTimezone(event.target.value)}
                placeholder="America/Los_Angeles"
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="admin-profile-locale" className="text-sm font-medium">
                Locale
              </label>
              <Input
                id="admin-profile-locale"
                value={locale}
                onChange={(event) => setLocale(event.target.value)}
                placeholder="en-US"
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="admin-profile-country" className="text-sm font-medium">
                Country code
              </label>
              <Input
                id="admin-profile-country"
                value={countryCode}
                onChange={(event) => setCountryCode(event.target.value.toUpperCase())}
                placeholder="US"
                maxLength={2}
                disabled={isPending}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border px-4 py-3">
              <div>
                <p className="text-sm font-medium">Marketing emails</p>
                <p className="text-xs text-muted-foreground">
                  Send product updates and promotional campaigns.
                </p>
              </div>
              <Switch
                checked={marketingEmails}
                onCheckedChange={setMarketingEmails}
                disabled={isPending}
                aria-label="Toggle marketing emails"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border px-4 py-3">
              <div>
                <p className="text-sm font-medium">SMS alerts</p>
                <p className="text-xs text-muted-foreground">
                  Enable SMS notifications where available.
                </p>
              </div>
              <Switch
                checked={smsAlerts}
                onCheckedChange={setSmsAlerts}
                disabled={isPending}
                aria-label="Toggle SMS alerts"
              />
            </div>
          </div>

          {feedback && (
            <Alert variant={feedback.success ? 'default' : 'destructive'}>
              <AlertDescription>{feedback.message}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving…' : 'Save preferences'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
