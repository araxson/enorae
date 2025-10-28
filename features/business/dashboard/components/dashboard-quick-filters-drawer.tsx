'use client'

import { useId, useState } from 'react'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export function DashboardQuickFiltersDrawer() {
  const [open, setOpen] = useState(false)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="md:hidden">
          Filters
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Quick filters</DrawerTitle>
          <DrawerDescription>Select which dashboard signals are highlighted.</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 px-4 pb-4">
          <FilterToggle label="Show confirmed only" defaultChecked />
          <FilterToggle label="Include flagged reviews" />
          <FilterToggle label="Highlight upsell opportunities" defaultChecked />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

type FilterToggleProps = {
  label: string
  defaultChecked?: boolean
}

function FilterToggle({ label, defaultChecked }: FilterToggleProps) {
  const switchId = useId()

  return (
    <div className="flex items-center justify-between gap-4">
      <Label htmlFor={switchId} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <Switch id={switchId} defaultChecked={defaultChecked} />
    </div>
  )
}
