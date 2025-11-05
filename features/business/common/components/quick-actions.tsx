'use client'


import Link from 'next/link'
import { Calendar, Users, Scissors, Settings, Sparkles, LineChart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
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
    href: '/business/analytics',
    label: 'View Analytics',
    icon: Sparkles,
    description: 'Review performance trends',
  },
  {
    href: '/business/insights',
    label: 'Insights',
    icon: LineChart,
    description: 'Identify opportunities across locations',
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Jump into daily operations and growth tasks.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex justify-end">
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
          </div>

          <NavigationMenu className="justify-start">
            <NavigationMenuList className="gap-2">
              {primaryActions.map((action) => (
                <NavigationMenuItem key={action.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <NavigationMenuLink asChild>
                        <Link href={action.href} className={navigationMenuTriggerStyle()}>
                          <action.icon className="mr-2 size-4" aria-hidden="true" />
                          <span>{action.label}</span>
                        </Link>
                      </NavigationMenuLink>
                    </TooltipTrigger>
                    <TooltipContent>{action.description}</TooltipContent>
                  </Tooltip>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <NavigationMenu className="justify-start">
            <NavigationMenuList className="gap-2">
              {secondaryActions.map((action) => (
                <NavigationMenuItem key={action.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <NavigationMenuLink asChild>
                        <Link href={action.href} className={navigationMenuTriggerStyle()}>
                          <action.icon className="mr-2 size-4" aria-hidden="true" />
                          <span>{action.label}</span>
                        </Link>
                      </NavigationMenuLink>
                    </TooltipTrigger>
                    <TooltipContent>{action.description}</TooltipContent>
                  </Tooltip>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/business/settings/salon"
                        className={navigationMenuTriggerStyle()}
                      >
                        <Settings className="mr-2 size-4" aria-hidden="true" />
                        <span>Salon settings</span>
                      </Link>
                    </NavigationMenuLink>
                  </TooltipTrigger>
                  <TooltipContent>Configure salon preferences</TooltipContent>
                </Tooltip>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </CardContent>
    </Card>
  )
}
