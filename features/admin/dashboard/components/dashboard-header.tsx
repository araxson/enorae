import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import {
  Activity,
  LineChart,
  MessageSquareWarning,
  ShieldAlert,
  ShieldCheck,
  Settings,
} from 'lucide-react'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { RefreshButton, LastUpdated } from '@/features/shared/ui'

interface DashboardHeaderProps {
  totalSalons: number
  pendingVerifications: number
}

export function DashboardHeader({ totalSalons, pendingVerifications }: DashboardHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item variant="muted">
            <ItemHeader>
              <ItemMedia variant="icon">
                <Activity className="size-5" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                <ItemTitle>Platform control center</ItemTitle>
                <ItemDescription>
                  Monitor platform health, engagement, and operational signals in real time.
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant="outline">Live feed</Badge>
              </ItemActions>
            </ItemHeader>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full">
            <ItemGroup>
              <Item variant="muted">
                <ItemContent>
                  <div className="flex w-full flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <LastUpdated />
                    <Separator orientation="vertical" className="hidden h-4 lg:flex" />
                    <span>
                      {`Synced across ${totalSalons.toLocaleString()} ${
                        totalSalons === 1 ? 'salon' : 'salons'
                      }`}
                    </span>
                    {pendingVerifications > 0 && (
                      <>
                        <Separator orientation="vertical" className="hidden h-4 lg:flex" />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href="/admin/users" className="inline-flex items-center">
                              <Badge variant="secondary">
                                <ShieldAlert className="mr-1 size-3" />
                                {pendingVerifications}{' '}
                                {pendingVerifications === 1 ? 'unverified user' : 'unverified users'}
                              </Badge>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>Click to view users with unverified email addresses</TooltipContent>
                        </Tooltip>
                      </>
                    )}
                  </div>
                </ItemContent>
              </Item>
            </ItemGroup>
          </div>

          <ButtonGroup aria-label="Dashboard actions">
            <Tooltip>
              <TooltipTrigger asChild>
                <RefreshButton />
              </TooltipTrigger>
              <TooltipContent>Refresh dashboard data</TooltipContent>
            </Tooltip>

            <Button asChild size="sm">
              <Link href="/admin/chains" className="flex items-center gap-2">
                Manage chains
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 size-4" />
                  Quick actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>Navigate to</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/analytics" className="flex items-center gap-2">
                    <LineChart className="size-4" />
                    Platform analytics
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/moderation" className="flex items-center gap-2">
                    <MessageSquareWarning className="size-4" />
                    Review moderation
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/security" className="flex items-center gap-2">
                    <ShieldCheck className="size-4" />
                    Security center
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
        </div>
      </CardContent>
    </Card>
  )
}
