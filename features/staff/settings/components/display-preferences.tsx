'use client'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updateUserPreferences } from '../api/mutations'
import type { DisplayPreferences } from '../types'

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
    <Card className="p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold">Display Preferences</h3>
          <p className="text-sm text-muted-foreground">Customize your interface</p>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="theme">Theme</Label>
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
          </div>

          <div>
            <Label htmlFor="time_format">Time Format</Label>
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
          </div>

          <div>
            <Label htmlFor="date_format">Date Format</Label>
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
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Card>
  )
}
