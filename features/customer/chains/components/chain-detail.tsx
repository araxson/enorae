import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Store, Users, MapPin } from 'lucide-react'
import type { SalonChainWithLocations } from '@/features/customer/chains/api/queries'

interface ChainDetailProps {
  chain: SalonChainWithLocations
}

export function ChainDetail({ chain }: ChainDetailProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Chain Header */}
      <Card>
        <CardHeader className="space-y-2">
          <div className="flex gap-4 items-center">
            <CardTitle>{chain.name}</CardTitle>
            {chain.is_verified ? <Badge variant="default">Verified</Badge> : null}
          </div>
          {chain.legal_name && chain.legal_name !== chain.name ? (
            <CardDescription>Legal name: {chain.legal_name}</CardDescription>
          ) : null}
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="flex gap-3 items-start">
              <Store className="mt-1 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <div>
                <p className="text-xs text-muted-foreground">Locations</p>
                <p className="text-sm text-foreground">{chain.salon_count || 0} {chain.salon_count === 1 ? 'salon' : 'salons'}</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <Users className="mt-1 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <div>
                <p className="text-xs text-muted-foreground">Staff members</p>
                <p className="text-sm text-foreground">{chain.staff_count || 0}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex gap-3 items-center">
            <Store className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              {chain.salon_count || 0} {chain.salon_count === 1 ? 'Location' : 'Locations'}
            </p>
          </div>
        </CardFooter>
      </Card>

      {/* Locations */}
      <div>
        <h3 className="mb-4 text-xl text-foreground">Locations</h3>
        {chain.locations && chain.locations.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {chain.locations.map((salon) => (
              <Card key={salon.id}>
                <CardHeader className="flex items-start justify-between">
                  <CardTitle>{salon.name}</CardTitle>
                  {salon.is_verified ? <Badge variant="secondary">Verified</Badge> : null}
                </CardHeader>
                <CardContent className="space-y-2">
                  {salon.address ? (
                    <div className="flex gap-2 items-start">
                      <MapPin className="mt-1 h-3 w-3 text-muted-foreground" aria-hidden="true" />
                      <p className="text-sm text-muted-foreground">{salon.address}</p>
                    </div>
                  ) : null}

                  {typeof salon.average_rating === 'number' ? (
                    <p className="text-sm text-muted-foreground">
                      ⭐ {salon.average_rating.toFixed(1)} ({salon.review_count || 0} reviews)
                    </p>
                  ) : null}
                </CardContent>
                <CardFooter>
                  <Link href={`/customer/book/${salon.id}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full">
                      View salon
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="leading-7 text-muted-foreground text-center py-8">
            No locations found for this chain
          </p>
        )}
      </div>
    </div>
  )
}
