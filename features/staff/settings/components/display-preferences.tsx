'use client'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updateUserPreferences } from '@/features/staff/settings/api/mutations'
import type { DisplayPreferences } from '@/features/staff/settings/types'
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemContent,
  ItemGroup,
} from '@/components/ui/item'

interface DisplayPreferencesProps {
  initialPreferences: DisplayPreferences
}

export function DisplayPreferences({ initialPreferences }: DisplayPreferencesProps) {
  const [preferences, setPreferences] = useState(initialPreferences)
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (key: keyof DisplayPreferences, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await updateUserPreferences({ display_preferences: preferences })
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save preferences')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item variant="muted" size="sm">
            <ItemContent>
              <CardTitle>Display Preferences</CardTitle>
              <CardDescription>Customize your interface.</CardDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <FieldSet>
          <FieldLegend>Interface options</FieldLegend>
          <Field>
            <FieldLabel htmlFor="theme">Theme</FieldLabel>
            <FieldContent>
              <Select
                value={preferences.theme}
                onValueChange={(value) => handleChange('theme', value)}
              >
                <SelectTrigger id="theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="time_format">Time format</FieldLabel>
            <FieldContent>
              <Select
                value={preferences.time_format}
                onValueChange={(value) => handleChange('time_format', value)}
              >
                <SelectTrigger id="time_format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12-hour</SelectItem>
                  <SelectItem value="24h">24-hour</SelectItem>
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="date_format">Date format</FieldLabel>
            <FieldContent>
              <Select
                value={preferences.date_format}
                onValueChange={(value) => handleChange('date_format', value)}
              >
                <SelectTrigger id="date_format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>
        </FieldSet>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-end">
          <ButtonGroup>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </ButtonGroup>
        </div>
      </CardFooter>
    </Card>
  )
}
