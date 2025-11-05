'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Search } from 'lucide-react'

type CommandShortcut = {
  label: string
  href: string
  description?: string
}

function getPortalBasePath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) {
    return '/'
  }
  return `/${segments[0]}`
}

export function CommandMenu() {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const basePath = useMemo(() => getPortalBasePath(pathname), [pathname])

  const navigationItems: CommandShortcut[] = useMemo(
    () => [
      { label: 'Open Dashboard', href: basePath },
      { label: 'View Notifications', href: `${basePath}/notifications` },
      { label: 'Check Messages', href: `${basePath}/messages` },
      { label: 'Manage Settings', href: `${basePath}/settings` },
      { label: 'Edit Profile', href: `${basePath}/profile` },
    ],
    [basePath]
  )

  const actionItems: CommandShortcut[] = useMemo(
    () => [
      { label: 'Create Appointment', href: `${basePath}/appointments/new` },
      { label: 'Add Favorite Salon', href: `${basePath}/salons` },
    ],
    [basePath]
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSelect = (command: CommandShortcut) => {
    setOpen(false)
    router.push(command.href)
  }

  return (
    <>
      <Tooltip delayDuration={150}>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Open command palette"
            onClick={() => setOpen(true)}
            className="rounded-full"
          >
            <Search className="size-4" aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">
            Quick actions <span className="font-mono">⌘K</span>
          </p>
        </TooltipContent>
      </Tooltip>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search destinations or actions..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {navigationItems.map((item) => (
              <CommandItem
                key={item.href}
                value={item.label}
                onSelect={() => handleSelect(item)}
                className="flex items-center justify-between"
              >
                <span>{item.label}</span>
                {item.description ? (
                  <span className="text-xs text-muted-foreground">{item.description}</span>
                ) : null}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            {actionItems.map((item) => (
              <CommandItem
                key={item.href}
                value={item.label}
                onSelect={() => handleSelect(item)}
              >
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
