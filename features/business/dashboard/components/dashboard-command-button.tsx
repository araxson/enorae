'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Kbd } from '@/components/ui/kbd'
import { ButtonGroup } from '@/components/ui/button-group'

type NavigationItem = {
  label: string
  href: string
}

type CommandItemConfig = {
  label: string
  shortcut: string
  href?: string
}

type DashboardCommandButtonProps = {
  navigationItems: NavigationItem[]
  commandItems: CommandItemConfig[]
}

export function DashboardCommandButton({ navigationItems, commandItems }: DashboardCommandButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <ButtonGroup>
            <Button variant="outline" className="gap-2" onClick={() => setOpen(true)}>
              <Sparkles className="h-4 w-4" />
              Command
              <Kbd className="ml-1">⌘K</Kbd>
            </Button>
          </ButtonGroup>
        </TooltipTrigger>
        <TooltipContent>Search commands and quick links</TooltipContent>
      </Tooltip>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search actions..." />
        <CommandList>
          <CommandEmpty>No commands found.</CommandEmpty>
          <CommandGroup heading="Navigate">
            {navigationItems.map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => {
                  setOpen(false)
                  window.location.hash = item.href
                }}
              >
                {item.label}
                <CommandShortcut>↵</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Shortcuts">
            {commandItems.map((item) => (
              <CommandItem
                key={item.label}
                onSelect={() => {
                  setOpen(false)
                  if (item.href) window.location.href = item.href
                }}
              >
                {item.label}
                <CommandShortcut>{item.shortcut}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Resources">
            <CommandItem onSelect={() => setOpen(false)}>
              <Link href="/business/support">Contact support</Link>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
