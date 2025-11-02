import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users } from 'lucide-react'
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'
import { COMPLIANCE_BADGE_VARIANT, LICENSE_BADGE_VARIANT } from '@/features/admin/admin-common/constants/badge-variants'
import type { AdminSalon } from '@/features/admin/salons/api/queries'
import { formatCreatedDate, formatRevenue } from './table-utilities'

type MobileSalonsCardsProps = {
  salons: AdminSalon[]
}

export function MobileSalonsCards({ salons }: MobileSalonsCardsProps) {
  return (
    <div className="space-y-4">
      {salons.map((salon) => (
        <Card key={salon.id}>
          <CardHeader>
            <div className="pb-2">
              <ItemGroup>
                <Item className="items-start justify-between gap-2">
                  <ItemContent className="flex flex-col gap-1">
                    <ItemTitle>{salon.name}</ItemTitle>
                    <ItemDescription>
                      {formatCreatedDate(salon.created_at)}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Badge
                      variant={
                        COMPLIANCE_BADGE_VARIANT[
                          salon.complianceLevel as keyof typeof COMPLIANCE_BADGE_VARIANT
                        ]
                      }
                    >
                      {salon.complianceScore}
                    </Badge>
                  </ItemActions>
                </Item>
              </ItemGroup>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 pt-0">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="block font-medium">Type</span>
                  <span className="capitalize text-muted-foreground">salon</span>
                </div>
                <div>
                  <span className="block font-medium">Rating</span>
                  <span className="text-muted-foreground">
                    {salon.rating_average ? salon.rating_average.toFixed(1) : 'N/A'}
                    {salon.rating_count ? ` (${salon.rating_count})` : ''}
                  </span>
                </div>
                <div>
                  <span className="block font-medium">Revenue</span>
                  <span className="text-muted-foreground">
                    {formatRevenue(salon.total_revenue)}
                  </span>
                </div>
                <div>
                  <span className="block font-medium">Staff</span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Users className="size-3" />
                    {salon.staff_count || 0}
                  </span>
                  {salon.staffCapacityRatio > 1 && (
                    <span className="text-xs text-destructive">Over capacity</span>
                  )}
                </div>
                <div>
                  <span className="block font-medium">License</span>
                  <Badge
                    variant={
                      LICENSE_BADGE_VARIANT[
                        salon.licenseStatus as keyof typeof LICENSE_BADGE_VARIANT
                      ]
                    }
                  >
                    {salon.licenseStatus}
                  </Badge>
                  {salon.licenseDaysRemaining !== null && (
                    <span className="block text-xs text-muted-foreground">
                      {salon.licenseDaysRemaining >= 0
                        ? `${salon.licenseDaysRemaining} days`
                        : `${Math.abs(salon.licenseDaysRemaining)} days overdue`}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
