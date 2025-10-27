'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldContent, FieldDescription, FieldLabel, FieldSet } from '@/components/ui/field'

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
        <div className="flex flex-col gap-6 py-4">
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
          <FieldSet className="flex flex-col gap-2">
            <FieldLabel>Email digests</FieldLabel>
            <PreferenceCheckbox id="digest-daily" label="Daily performance email" defaultChecked />
            <PreferenceCheckbox id="digest-weekly" label="Weekly summary on Mondays" />
          </FieldSet>
        </div>
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
    <Field className="gap-2">
      <FieldContent className="flex items-center justify-between gap-4">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <Switch id={id} defaultChecked={defaultChecked} />
      </FieldContent>
      <FieldDescription>{description}</FieldDescription>
    </Field>
  )
}

type PreferenceCheckboxProps = {
  id: string
  label: string
  defaultChecked?: boolean
}

function PreferenceCheckbox({ id, label, defaultChecked }: PreferenceCheckboxProps) {
  return (
    <Field orientation="horizontal" className="items-center gap-3">
      <Checkbox id={id} defaultChecked={defaultChecked} />
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
    </Field>
  )
}
