'use client'

import { useState } from 'react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Stack, Group } from '@/components/layout'

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
        <Stack gap="md" className="px-4 pb-4">
          <FilterToggle label="Show confirmed only" defaultChecked />
          <FilterToggle label="Include flagged reviews" />
          <FilterToggle label="Highlight upsell opportunities" defaultChecked />
        </Stack>
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
    <Group className="items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <Switch defaultChecked={defaultChecked} />
    </Group>
  )
}
