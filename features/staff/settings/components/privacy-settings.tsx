'use client'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { updateUserPreferences } from '@/features/staff/settings/api/mutations'
import type { PrivacySettings } from '@/features/staff/settings/api/types'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
} from '@/components/ui/item'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { toast } from 'sonner'

interface PrivacySettingsProps {
  initialSettings: PrivacySettings
}

export function PrivacySettings({ initialSettings }: PrivacySettingsProps) {
  const [settings, setSettings] = useState(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleToggle = (key: keyof PrivacySettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError(null)
      await updateUserPreferences({ privacy_settings: settings })
      toast.success('Privacy settings saved')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save settings'
      setError(message)
      toast.error(message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>Control who can see your information.</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Unable to save settings</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        <FieldSet>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="profile_visible">Profile visible to clients</FieldLabel>
            <FieldContent>
              <ItemGroup>
                <Item variant="muted" size="sm">
                  <ItemContent>
                    <FieldDescription>Allow clients to view your profile</FieldDescription>
                  </ItemContent>
                  <ItemActions>
                    <Switch
                      id="profile_visible"
                      checked={settings.profile_visible_to_clients}
                      onCheckedChange={() => handleToggle('profile_visible_to_clients')}
                    />
                  </ItemActions>
                </Item>
              </ItemGroup>
            </FieldContent>
          </Field>

          <Field orientation="horizontal">
            <FieldLabel htmlFor="show_ratings">Show ratings</FieldLabel>
            <FieldContent>
              <ItemGroup>
                <Item variant="muted" size="sm">
                  <ItemContent>
                    <FieldDescription>Display your ratings publicly</FieldDescription>
                  </ItemContent>
                  <ItemActions>
                    <Switch
                      id="show_ratings"
                      checked={settings.show_ratings}
                      onCheckedChange={() => handleToggle('show_ratings')}
                    />
                  </ItemActions>
                </Item>
              </ItemGroup>
            </FieldContent>
          </Field>

          <Field orientation="horizontal">
            <FieldLabel htmlFor="show_appointments">Show completed appointments</FieldLabel>
            <FieldContent>
              <ItemGroup>
                <Item variant="muted" size="sm">
                  <ItemContent>
                    <FieldDescription>Display appointment count</FieldDescription>
                  </ItemContent>
                  <ItemActions>
                    <Switch
                      id="show_appointments"
                      checked={settings.show_completed_appointments}
                      onCheckedChange={() => handleToggle('show_completed_appointments')}
                    />
                  </ItemActions>
                </Item>
              </ItemGroup>
            </FieldContent>
          </Field>

          <Field orientation="horizontal">
            <FieldLabel htmlFor="allow_search">Allow profile search</FieldLabel>
            <FieldContent>
              <ItemGroup>
                <Item variant="muted" size="sm">
                  <ItemContent>
                    <FieldDescription>Let clients find you in search</FieldDescription>
                  </ItemContent>
                  <ItemActions>
                    <Switch
                      id="allow_search"
                      checked={settings.allow_profile_search}
                      onCheckedChange={() => handleToggle('allow_profile_search')}
                    />
                  </ItemActions>
                </Item>
              </ItemGroup>
            </FieldContent>
          </Field>
        </FieldSet>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-end">
          <ButtonGroup>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Spinner className="size-4" />
                  <span>Saving…</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </Button>
          </ButtonGroup>
        </div>
      </CardFooter>
    </Card>
  )
}
