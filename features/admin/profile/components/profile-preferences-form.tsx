'use client'

import { FormEvent, useEffect, useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'
import { Spinner } from '@/components/ui/spinner'
import { Item, ItemActions, ItemContent, ItemGroup } from '@/components/ui/item'
import type { ProfileDetail } from '@/features/admin/profile/types'
import { updateProfilePreferencesAction, type ActionResponse } from '@/features/admin/profile/api/mutations'

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
    setTimezone(profile['preferences']['timezone'] ?? profile.summary['timezone'] ?? '')
    setLocale(profile['preferences']['locale'] ?? profile.summary['locale'] ?? '')
    setCountryCode(profile['preferences'].countryCode ?? profile.summary.countryCode ?? '')

    const prefs = profile['preferences'].preferences
    setMarketingEmails(Boolean(prefs?.['marketingEmails']))
    setSmsAlerts(Boolean(prefs?.['smsAlerts']))
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
        profileId: profile.summary['id'],
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
      <CardHeader>
        <div className="pb-2">
        <ItemGroup>
          <Item variant="muted">
            <ItemContent>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Adjust locale, timezone, and notification preferences.</CardDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldSet>
            <FieldLegend variant="label">Regional settings</FieldLegend>
            <FieldGroup className="gap-4 sm:grid sm:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="admin-profile-timezone">Timezone</FieldLabel>
                <FieldContent>
                  <Input
                    id="admin-profile-timezone"
                    value={timezone}
                    onChange={(event) => setTimezone(event.target.value)}
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
                    onChange={(event) => setLocale(event.target.value)}
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
                    onChange={(event) => setCountryCode(event.target.value.toUpperCase())}
                    placeholder="US"
                    maxLength={2}
                    disabled={isPending}
                  />
                  <FieldDescription>Use ISO-3166 alpha-2.</FieldDescription>
                </FieldContent>
              </Field>
            </FieldGroup>
          </FieldSet>

          <div className="flex flex-col gap-3">
            <Card>
              <CardHeader>
                <div className="pb-2">
                <ItemGroup>
                  <Item variant="muted">
                    <ItemContent>
                      <CardTitle>Marketing emails</CardTitle>
                      <CardDescription>Send product updates and promotional campaigns.</CardDescription>
                    </ItemContent>
                  </Item>
                </ItemGroup>
                </div>
              </CardHeader>
              <CardContent>
                <div className="pt-0">
                  <ItemGroup className="items-center justify-between gap-4">
                    <Item variant="muted">
                      <ItemActions>
                        <Switch
                          checked={marketingEmails}
                          onCheckedChange={setMarketingEmails}
                          disabled={isPending}
                          aria-label="Toggle marketing emails"
                        />
                      </ItemActions>
                    </Item>
                  </ItemGroup>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="pb-2">
                <ItemGroup>
                  <Item variant="muted">
                    <ItemContent>
                      <CardTitle>SMS alerts</CardTitle>
                      <CardDescription>Enable SMS notifications where available.</CardDescription>
                    </ItemContent>
                  </Item>
                </ItemGroup>
                </div>
              </CardHeader>
              <CardContent>
                <div className="pt-0">
                  <ItemGroup className="items-center justify-between gap-4">
                    <Item variant="muted">
                      <ItemActions>
                        <Switch
                          checked={smsAlerts}
                          onCheckedChange={setSmsAlerts}
                          disabled={isPending}
                          aria-label="Toggle SMS alerts"
                        />
                      </ItemActions>
                    </Item>
                  </ItemGroup>
                </div>
              </CardContent>
            </Card>
          </div>

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
