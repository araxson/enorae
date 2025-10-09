'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Small } from '@/components/ui/typography'
import { Stack, Group } from '@/components/layout'

export function DashboardPreferencesSheet() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary">Workspace prefs</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Workspace preferences</SheetTitle>
          <SheetDescription>Adjust dashboard density and default filters.</SheetDescription>
        </SheetHeader>
        <Stack gap="lg" className="py-4">
          <PreferenceToggle
            id="show-revenue"
            label="Show revenue cards"
            description="Toggle off for teams focused on operations."
            defaultChecked
          />
          <PreferenceToggle
            id="highlight-reviews"
            label="Highlight review alerts"
            description="Alerts surface flagged reviews in the overview tab."
          />
          <Stack gap="xs">
            <span className="text-sm font-medium text-foreground">Email digests</span>
            <PreferenceCheckbox id="digest-daily" label="Daily performance email" defaultChecked />
            <PreferenceCheckbox id="digest-weekly" label="Weekly summary on Mondays" />
          </Stack>
        </Stack>
        <SheetFooter>
          <Button onClick={() => setOpen(false)}>Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

type PreferenceToggleProps = {
  id: string
  label: string
  description: string
  defaultChecked?: boolean
}

function PreferenceToggle({ id, label, description, defaultChecked }: PreferenceToggleProps) {
  return (
    <Stack gap="xs">
      <Group className="items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
        <Switch id={id} defaultChecked={defaultChecked} />
      </Group>
      <Small className="text-xs text-muted-foreground">{description}</Small>
    </Stack>
  )
}

type PreferenceCheckboxProps = {
  id: string
  label: string
  defaultChecked?: boolean
}

function PreferenceCheckbox({ id, label, defaultChecked }: PreferenceCheckboxProps) {
  return (
    <Group className="items-center gap-3">
      <Checkbox id={id} defaultChecked={defaultChecked} />
      <label htmlFor={id} className="text-sm text-muted-foreground">
        {label}
      </label>
    </Group>
  )
}
