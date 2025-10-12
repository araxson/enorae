import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stack, Flex, Box } from '@/components/layout'
import { H3, P, Small, Muted } from '@/components/ui/typography'
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
              <H3>{chain.name}</H3>
              {chain.headquarters_address && (
                <Flex gap="xs" align="center" className="mt-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <Small className="text-muted-foreground">
                    {chain.headquarters_address}
                  </Small>
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
              <Muted>
                {chain.salon_count || 0} {chain.salon_count === 1 ? 'Location' : 'Locations'}
              </Muted>
            </Flex>
          </Flex>

          {chain.website && (
            <P className="text-sm text-primary hover:underline">Visit Website →</P>
          )}
        </Stack>
      </Card>
    </Link>
  )
}
