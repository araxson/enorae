'use client'

import Link from 'next/link'
import { Calendar, Users, Scissors, Package, Settings, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from '@/components/ui/button-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Stack } from '@/components/layout'

const primaryActions = [
  {
    href: '/business/appointments',
    label: 'View Appointments',
    icon: Calendar,
    description: 'Confirm and monitor bookings',
  },
  {
    href: '/business/staff',
    label: 'Manage Staff',
    icon: Users,
    description: 'Update schedules & roles',
  },
  {
    href: '/business/services',
    label: 'Manage Services',
    icon: Scissors,
    description: 'Curate the catalog',
  },
]

const secondaryActions = [
  {
    href: '/business/inventory',
    label: 'Inventory',
    icon: Package,
    description: 'Track stock levels',
  },
  {
    href: '/business/analytics',
    label: 'View Analytics',
    icon: Sparkles,
    description: 'Review performance trends',
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Quick Actions</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              More shortcuts
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/business/time-off">Request time off</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/business/settings/account">Update account settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/business/reviews">Respond to reviews</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <Stack gap="md">
          <ButtonGroup className="w-full">
            <ButtonGroupText className="hidden sm:flex">
              Core operations
            </ButtonGroupText>
            {primaryActions.map((action) => (
              <Tooltip key={action.href}>
                <TooltipTrigger asChild>
                  <Button asChild variant="outline" className="h-auto flex-1 flex-col gap-2 py-4">
                    <Link href={action.href}>
                      <action.icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{action.label}</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{action.description}</TooltipContent>
              </Tooltip>
            ))}
          </ButtonGroup>

          <Separator />

          <ButtonGroup className="w-full">
            <ButtonGroupText className="hidden sm:flex">
              Growth
            </ButtonGroupText>
            {secondaryActions.map((action) => (
              <Tooltip key={action.href}>
                <TooltipTrigger asChild>
                  <Button asChild variant="outline" className="h-auto flex-1 flex-col gap-2 py-4">
                    <Link href={action.href}>
                      <action.icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{action.label}</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{action.description}</TooltipContent>
              </Tooltip>
            ))}
            <ButtonGroupSeparator className="hidden sm:block" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild variant="outline" className="h-auto flex-1 flex-col gap-2 py-4">
                  <Link href="/business/settings/salon">
                    <Settings className="h-5 w-5" />
                    <span className="text-xs font-medium">Settings</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Configure salon preferences</TooltipContent>
            </Tooltip>
          </ButtonGroup>
        </Stack>
      </CardContent>
    </Card>
  )
}
