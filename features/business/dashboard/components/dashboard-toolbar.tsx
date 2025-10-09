'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Target } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { Stack, Group } from '@/components/layout'
import { Small } from '@/components/ui/typography'
import { DashboardCommandButton } from './dashboard-command-button'
import { DashboardPreferencesSheet } from './dashboard-preferences-sheet'
import { DashboardQuickFiltersDrawer } from './dashboard-quick-filters-drawer'

const NAVIGATION_ITEMS = [
  { label: 'Overview', href: '#overview' },
  { label: 'Appointments', href: '#appointments' },
  { label: 'Analytics', href: '#analytics' },
  { label: 'Reviews', href: '#reviews' },
]

const COMMAND_ITEMS = [
  { label: 'Create appointment', shortcut: 'A', href: '/business/appointments' },
  { label: 'Invite staff member', shortcut: 'S', href: '/business/staff' },
  { label: 'Open analytics', shortcut: '⇧ + G', href: '/business/analytics' },
  { label: 'Update hours', shortcut: 'H', href: '/business/hours' },
]

const TIMEFRAME_OPTIONS = [
  { label: 'Last 7 days', value: '7' },
  { label: 'Last 30 days', value: '30' },
  { label: 'Last 90 days', value: '90' },
]

type DashboardToolbarProps = {
  salonName: string
  isTenantOwner: boolean
  totalLocations?: number
}

export function DashboardToolbar({ salonName, isTenantOwner, totalLocations }: DashboardToolbarProps) {
  const [timeframe, setTimeframe] = useState<'7' | '30' | '90'>('30')

  return (
    <Stack gap="md" className="rounded-xl border bg-card/40 px-4 py-3 shadow-sm md:px-6">
      <Group className="flex-wrap items-center justify-between gap-4">
        <Group gap="sm" className="items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{salonName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <Stack gap="xs">
            <span className="text-sm font-semibold text-foreground">{salonName}</span>
            <Small className="text-muted-foreground">
              Review bookings, revenue, and reputation signals at a glance.
            </Small>
          </Stack>
          {isTenantOwner && totalLocations ? (
            <Badge variant="secondary" className="gap-1">
              <LayoutDashboard className="h-3 w-3" />
              {totalLocations} locations
            </Badge>
          ) : null}
        </Group>

        <Group gap="sm" className="items-center">
          <DashboardCommandButton navigationItems={NAVIGATION_ITEMS} commandItems={COMMAND_ITEMS} />
          <DashboardPreferencesSheet />
          <DashboardQuickFiltersDrawer />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant="outline" className="hidden md:inline-flex">
                <Link href="/business/support">Support</Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Contact support or browse help center</TooltipContent>
          </Tooltip>
        </Group>
      </Group>

      <Group className="flex-wrap items-center justify-between gap-3">
        <Group gap="sm" className="items-center">
          <Small className="font-medium text-muted-foreground">Timeframe</Small>
          <Select value={timeframe} onValueChange={(value) => setTimeframe(value as typeof timeframe)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              {TIMEFRAME_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Group>
        <Group gap="sm" className="items-center text-xs text-muted-foreground">
          <Badge variant="outline">Timeframe {timeframe} days</Badge>
          <Badge variant="outline">{isTenantOwner ? 'Tenant owner' : 'Team member'}</Badge>
        </Group>
      </Group>

      <Separator />

      <Alert variant="default" className="bg-muted/30">
        <AlertTitle className="flex items-center gap-2 text-sm font-medium">
          <Target className="h-4 w-4 text-primary" />
          Weekly momentum
        </AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground">
          Confirmation rate is holding steady. Encourage stylists to respond to pending bookings to keep the momentum.
        </AlertDescription>
      </Alert>
    </Stack>
  )
}
