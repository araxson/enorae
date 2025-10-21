'use client'

import { useState } from 'react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'

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
  return (
    <div className="flex gap-4 items-center items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <Switch defaultChecked={defaultChecked} />
    </div>
  )
}
