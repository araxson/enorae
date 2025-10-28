import { Crown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { RefreshButton, LastUpdated } from '@/features/shared/ui-components'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

interface DashboardHeaderProps {
  isVIP: boolean
  loyaltyTier?: string | null
}

export function DashboardHeader({ isVIP, loyaltyTier }: DashboardHeaderProps) {
  return (
    <ItemGroup className="gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Item variant="muted" size="sm" className="flex-1">
        {isVIP ? (
          <>
            <ItemMedia variant="icon">
              <Crown className="h-4 w-4" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>VIP member</ItemTitle>
              <ItemDescription>Tier {loyaltyTier?.toUpperCase() ?? 'Standard'}</ItemDescription>
            </ItemContent>
            <ItemActions className="flex-none">
              <Badge variant="default">VIP</Badge>
            </ItemActions>
          </>
        ) : (
          <ItemContent>
            <ItemTitle>Welcome back</ItemTitle>
            <ItemDescription>Pick up where you left off.</ItemDescription>
          </ItemContent>
        )}
      </Item>
      <Item variant="muted" size="sm" className="flex-1">
        <ItemContent>
          <ItemTitle>Dashboard status</ItemTitle>
          <ItemDescription>
            <LastUpdated />
          </ItemDescription>
        </ItemContent>
        <ItemActions className="flex-none items-center gap-3 text-sm text-muted-foreground">
          <Separator orientation="vertical" className="hidden h-4 sm:block" />
          <RefreshButton />
        </ItemActions>
      </Item>
    </ItemGroup>
  )
}
