import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Store } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type SalonChain = Database['public']['Views']['salon_chains_view']['Row']

interface ChainCardProps {
  chain: SalonChain
}

export function ChainCard({ chain }: ChainCardProps) {
  return (
    <Link href={`/customer/chains/${chain['slug']}`} className="block">
      <Card>
        <CardHeader className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle>{chain['name']}</CardTitle>
            {chain['legal_name'] && chain['legal_name'] !== chain['name'] ? (
              <CardDescription>{chain['legal_name']}</CardDescription>
            ) : null}
          </div>
          {chain['is_verified'] ? <Badge variant="default">Verified</Badge> : null}
        </CardHeader>

        <CardContent>
          <div className="flex gap-3 items-center">
            <Store className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              {chain['salon_count'] || 0} {chain['salon_count'] === 1 ? 'Location' : 'Locations'}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
