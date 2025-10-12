import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Stack, Flex, Box, Grid } from '@/components/layout'
import { H2, H3, P, Muted } from '@/components/ui/typography'
import { MapPin, Store, Globe, Mail, Phone } from 'lucide-react'
import type { SalonChainWithLocations } from '../api/queries'

interface ChainDetailProps {
  chain: SalonChainWithLocations
}

export function ChainDetail({ chain }: ChainDetailProps) {
  return (
    <Stack gap="xl">
      {/* Chain Header */}
      <Card className="p-6">
        <Stack gap="md">
          <Flex justify="between" align="start">
            <Box>
              <Flex gap="md" align="center">
                <H2>{chain.name}</H2>
                {chain.is_verified && (
                  <Badge variant="default">Verified</Badge>
                )}
              </Flex>
              {chain.legal_name && chain.legal_name !== chain.name && (
                <Muted>Legal name: {chain.legal_name}</Muted>
              )}
            </Box>
          </Flex>

          <Grid cols={{ base: 1, md: 2 }} gap="md">
            {chain.headquarters_address && (
              <Flex gap="sm" align="start">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <Box>
                  <Muted className="text-xs">Headquarters</Muted>
                  <P className="text-sm">{chain.headquarters_address}</P>
                </Box>
              </Flex>
            )}

            {chain.corporate_phone && (
              <Flex gap="sm" align="start">
                <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                <Box>
                  <Muted className="text-xs">Corporate Phone</Muted>
                  <P className="text-sm">{chain.corporate_phone}</P>
                </Box>
              </Flex>
            )}

            {chain.corporate_email && (
              <Flex gap="sm" align="start">
                <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                <Box>
                  <Muted className="text-xs">Corporate Email</Muted>
                  <P className="text-sm">{chain.corporate_email}</P>
                </Box>
              </Flex>
            )}

            {chain.website && (
              <Flex gap="sm" align="start">
                <Globe className="h-4 w-4 text-muted-foreground mt-1" />
                <Box>
                  <Muted className="text-xs">Website</Muted>
                  <a
                    href={chain.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Visit Website
                  </a>
                </Box>
              </Flex>
            )}
          </Grid>

          <Flex gap="md" align="center">
            <Flex gap="xs" align="center">
              <Store className="h-4 w-4 text-muted-foreground" />
              <Muted>
                {chain.salon_count || 0} {chain.salon_count === 1 ? 'Location' : 'Locations'}
              </Muted>
            </Flex>
          </Flex>
        </Stack>
      </Card>

      {/* Locations */}
      <Box>
        <H3 className="mb-4">Locations</H3>
        {chain.locations && chain.locations.length > 0 ? (
          <Grid cols={{ base: 1, md: 2 }} gap="md">
            {chain.locations.map((salon) => (
              <Card key={salon.id} className="p-4">
                <Stack gap="sm">
                  <Flex justify="between" align="start">
                    <H3 className="text-lg">{salon.name}</H3>
                    {salon.is_verified && (
                      <Badge variant="secondary" className="text-xs">Verified</Badge>
                    )}
                  </Flex>

                  {salon.address && (
                    <Flex gap="xs" align="start">
                      <MapPin className="h-3 w-3 text-muted-foreground mt-1" />
                      <Muted className="text-sm">{salon.address}</Muted>
                    </Flex>
                  )}

                  {typeof salon.average_rating === 'number' && (
                    <Muted className="text-sm">
                      ⭐ {salon.average_rating.toFixed(1)} ({salon.review_count || 0} reviews)
                    </Muted>
                  )}

                  <Link href={`/customer/book/${salon.id}`}>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      View Salon
                    </Button>
                  </Link>
                </Stack>
              </Card>
            ))}
          </Grid>
        ) : (
          <P className="text-muted-foreground text-center py-8">
            No locations found for this chain
          </P>
        )}
      </Box>
    </Stack>
  )
}
