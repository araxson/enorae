import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Small } from '@/components/ui/typography'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/shared'
import {
  Item,
  ItemGroup,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemSeparator,
} from '@/components/ui/item'
import type { SalonView } from '@/lib/types/view-extensions'
import { format } from 'date-fns'
import { Building2 } from 'lucide-react'

interface RecentSalonsProps {
  salons: SalonView[]
}

export function RecentSalons({ salons }: RecentSalonsProps) {
  if (salons.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No Salons Yet"
        description="No salons have been registered on the platform yet"
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Salons</CardTitle>
        <Small>{salons.length} recently added</Small>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          {salons.map((salon, index) => (
            <div key={salon.id}>
              <Item variant="outline" size="default">
                <ItemMedia variant="icon">
                  <Building2 className="h-5 w-5" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{salon.name || 'Unnamed Salon'}</ItemTitle>
                  <ItemDescription>
                    {salon.description || 'No description provided'}
                    {' • Added '}
                    {salon.created_at ? format(new Date(salon.created_at), 'MMM d, yyyy') : 'Recently'}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Badge variant={salon.is_active === true ? 'default' : 'outline'}>
                    {salon.is_active === true ? 'Active' : 'Inactive'}
                  </Badge>
                </ItemActions>
              </Item>
              {index < salons.length - 1 && <ItemSeparator />}
            </div>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
