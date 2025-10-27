import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Store } from 'lucide-react'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import type { Database } from '@/lib/types/database.types'

type SalonChain = Database['public']['Views']['salon_chains_view']['Row']

interface ChainCardProps {
  chain: SalonChain
}

export function ChainCard({ chain }: ChainCardProps) {
  return (
    <Link href={`/customer/chains/${chain['slug']}`} className="block">
      <Card>
        <CardHeader>
          <ItemGroup>
            <Item>
              <ItemContent>
                <CardTitle>{chain['name']}</CardTitle>
                {chain['legal_name'] && chain['legal_name'] !== chain['name'] ? (
                  <CardDescription>{chain['legal_name']}</CardDescription>
                ) : null}
              </ItemContent>
              {chain['is_verified'] ? (
                <ItemActions className="flex-none">
                  <Badge variant="default">Verified</Badge>
                </ItemActions>
              ) : null}
            </Item>
          </ItemGroup>
        </CardHeader>

        <CardContent>
          <ItemGroup>
            <Item variant="muted" size="sm">
              <ItemMedia variant="icon">
                <Store className="h-4 w-4" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Locations</ItemTitle>
                <ItemDescription>
                  {chain['salon_count'] || 0} {chain['salon_count'] === 1 ? 'Location' : 'Locations'}
                </ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardContent>
      </Card>
    </Link>
  )
}
