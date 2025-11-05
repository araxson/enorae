'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Users,
  Building2,
  Calendar,
  Shield,
  BarChart,
  MessageSquare,
  Settings,
  Database,
  UserCog,
  TrendingUp,
} from 'lucide-react'

export function AdminCommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search admin functions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Management">
          <CommandItem
            onSelect={() => runCommand(() => router.push('/admin/users'))}
          >
            <Users className="mr-2 h-4 w-4" />
            <span>User Management</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/admin/salons'))}
          >
            <Building2 className="mr-2 h-4 w-4" />
            <span>Salon Management</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/admin/roles'))}
          >
            <Shield className="mr-2 h-4 w-4" />
            <span>Role Management</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/admin/staff'))}
          >
            <UserCog className="mr-2 h-4 w-4" />
            <span>Staff Management</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Analytics">
          <CommandItem
            onSelect={() => runCommand(() => router.push('/admin/analytics'))}
          >
            <BarChart className="mr-2 h-4 w-4" />
            <span>Platform Analytics</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/admin/appointments'))}
          >
            <Calendar className="mr-2 h-4 w-4" />
            <span>Appointment Oversight</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/admin/chains'))}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            <span>Chain Analytics</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Moderation">
          <CommandItem
            onSelect={() => runCommand(() => router.push('/admin/moderation'))}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Content Moderation</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="System">
          <CommandItem
            onSelect={() => runCommand(() => router.push('/admin/database-health'))}
          >
            <Database className="mr-2 h-4 w-4" />
            <span>Database Health</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/admin/security'))}
          >
            <Shield className="mr-2 h-4 w-4" />
            <span>Security Monitoring</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/admin/settings'))}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Platform Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
