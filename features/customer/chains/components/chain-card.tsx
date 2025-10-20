import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stack, Flex, Box } from '@/components/layout'
import { MapPin, Store } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type SalonChain = Database['public']['Views']['salon_chains']['Row']

interface ChainCardProps {
  chain: SalonChain
}

export function ChainCard({ chain }: ChainCardProps) {
  return (
    <Link href={`/customer/chains/${chain.slug}`}>
      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <Stack gap="md">
          <Flex justify="between" align="start">
            <Box>
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{chain.name}</h3>
              {chain.headquarters_address && (
                <Flex gap="xs" align="center" className="mt-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <small className="text-sm font-medium leading-none text-muted-foreground">
                    {chain.headquarters_address}
                  </small>
                </Flex>
              )}
            </Box>
            {chain.is_verified && (
              <Badge variant="default">Verified</Badge>
            )}
          </Flex>

          <Flex gap="md" align="center">
            <Flex gap="xs" align="center">
              <Store className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {chain.salon_count || 0} {chain.salon_count === 1 ? 'Location' : 'Locations'}
              </p>
            </Flex>
          </Flex>

          {chain.website && (
            <p className="leading-7 text-sm text-primary hover:underline">Visit Website →</p>
          )}
        </Stack>
      </Card>
    </Link>
  )
}
