'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Target } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
    <Card>
      <CardHeader className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{salonName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 space-y-1">
            <CardTitle>{salonName}</CardTitle>
            <CardDescription>
              Review bookings, revenue, and reputation signals at a glance.
            </CardDescription>
          </div>
          {isTenantOwner && totalLocations ? (
            <Badge variant="secondary" className="flex items-center gap-1">
              <LayoutDashboard className="h-3 w-3" aria-hidden="true" />
              {totalLocations} locations
            </Badge>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
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
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium text-muted-foreground">Timeframe</p>
            <Select value={timeframe} onValueChange={(value) => setTimeframe(value as typeof timeframe)}>
              <SelectTrigger className="w-40">
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
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Badge variant="outline" className="flex items-center gap-1">
              Timeframe {timeframe} days
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              {isTenantOwner ? 'Tenant owner' : 'Team member'}
            </Badge>
          </div>
        </div>

        <Separator />

        <Alert>
          <Target className="h-4 w-4 text-primary" aria-hidden="true" />
          <AlertTitle>Weekly momentum</AlertTitle>
          <AlertDescription>
            Confirmation rate is holding steady. Encourage stylists to respond to pending bookings to keep the momentum.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
