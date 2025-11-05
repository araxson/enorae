'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Kbd } from '@/components/ui/kbd'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const navigationItems = [
  { label: 'Explore Salons', href: '/explore', group: 'Browse' },
  { label: 'How It Works', href: '/how-it-works', group: 'Browse' },
  { label: 'Pricing', href: '/pricing', group: 'Browse' },
  { label: 'About Enorae', href: '/about', group: 'Company' },
  { label: 'FAQ', href: '/faq', group: 'Company' },
  { label: 'Contact', href: '/contact', group: 'Company' },
]

const accountItems = [
  { label: 'Sign Up', href: '/signup' },
  { label: 'Login', href: '/login' },
]

export function MarketingCommandMenu() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [shortcutHint, setShortcutHint] = useState<'⌘K' | 'Ctrl K'>('⌘K')

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().includes('MAC')
      if ((isMac && event.metaKey && event.key === 'k') || (!isMac && event.ctrlKey && event.key === 'k')) {
        event.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    const isMac = navigator.platform.toUpperCase().includes('MAC')
    setShortcutHint(isMac ? '⌘K' : 'Ctrl K')
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  function navigateTo(path: string) {
    setOpen(false)
    router.push(path)
  }

  const groupedNavigation = navigationItems.reduce<Record<string, { label: string; href: string }[]>>(
    (acc, item) => {
      if (!acc[item.group]) {
        acc[item.group] = []
      }
      acc[item.group]!.push({ label: item.label, href: item.href })
      return acc
    },
    {},
  )

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(true)}
              aria-label="Open quick navigation"
              className="w-full justify-start sm:w-auto"
            >
              <Search className="mr-2 size-4" aria-hidden="true" />
              Quick find
              <Kbd className="ml-2 hidden sm:inline-flex">{shortcutHint}</Kbd>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Search pages and actions</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search marketing pages..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {Object.entries(groupedNavigation).map(([group, items]) => (
            <CommandGroup key={group} heading={group}>
              {items.map((item) => (
                <CommandItem key={item.href} value={item.label} onSelect={() => navigateTo(item.href)}>
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
          <CommandSeparator />
          <CommandGroup heading="Account">
            {accountItems.map((item) => (
              <CommandItem key={item.href} value={item.label} onSelect={() => navigateTo(item.href)}>
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
