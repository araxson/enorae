import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Store } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type SalonChain = Database['public']['Views']['salon_chains']['Row']

interface ChainCardProps {
  chain: SalonChain
}

export function ChainCard({ chain }: ChainCardProps) {
  return (
    <Link href={`/customer/chains/${chain.slug}`} className="block">
      <Card>
        <CardHeader className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle>{chain.name}</CardTitle>
            {chain.headquarters_address ? (
              <div className="flex gap-2 items-center">
                <MapPin className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                <CardDescription>{chain.headquarters_address}</CardDescription>
              </div>
            ) : null}
          </div>
          {chain.is_verified ? <Badge variant="default">Verified</Badge> : null}
        </CardHeader>

        <CardContent>
          <div className="flex gap-3 items-center">
            <Store className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              {chain.salon_count || 0} {chain.salon_count === 1 ? 'Location' : 'Locations'}
            </p>
          </div>
        </CardContent>

        {chain.website ? (
          <CardFooter>
            <span className="text-sm text-primary underline-offset-4 hover:underline">Visit website →</span>
          </CardFooter>
        ) : null}
      </Card>
    </Link>
  )
}
