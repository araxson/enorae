import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Stack, Flex, Box, Grid } from '@/components/layout'
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
                <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">{chain.name}</h2>
                {chain.is_verified && (
                  <Badge variant="default">Verified</Badge>
                )}
              </Flex>
              {chain.legal_name && chain.legal_name !== chain.name && (
                <p className="text-sm text-muted-foreground">Legal name: {chain.legal_name}</p>
              )}
            </Box>
          </Flex>

          <Grid cols={{ base: 1, md: 2 }} gap="md">
            {chain.headquarters_address && (
              <Flex gap="sm" align="start">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <Box>
                  <p className="text-sm text-muted-foreground text-xs">Headquarters</p>
                  <p className="leading-7 text-sm">{chain.headquarters_address}</p>
                </Box>
              </Flex>
            )}

            {chain.corporate_phone && (
              <Flex gap="sm" align="start">
                <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                <Box>
                  <p className="text-sm text-muted-foreground text-xs">Corporate Phone</p>
                  <p className="leading-7 text-sm">{chain.corporate_phone}</p>
                </Box>
              </Flex>
            )}

            {chain.corporate_email && (
              <Flex gap="sm" align="start">
                <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                <Box>
                  <p className="text-sm text-muted-foreground text-xs">Corporate Email</p>
                  <p className="leading-7 text-sm">{chain.corporate_email}</p>
                </Box>
              </Flex>
            )}

            {chain.website && (
              <Flex gap="sm" align="start">
                <Globe className="h-4 w-4 text-muted-foreground mt-1" />
                <Box>
                  <p className="text-sm text-muted-foreground text-xs">Website</p>
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
              <p className="text-sm text-muted-foreground">
                {chain.salon_count || 0} {chain.salon_count === 1 ? 'Location' : 'Locations'}
              </p>
            </Flex>
          </Flex>
        </Stack>
      </Card>

      {/* Locations */}
      <Box>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">Locations</h3>
        {chain.locations && chain.locations.length > 0 ? (
          <Grid cols={{ base: 1, md: 2 }} gap="md">
            {chain.locations.map((salon) => (
              <Card key={salon.id} className="p-4">
                <Stack gap="sm">
                  <Flex justify="between" align="start">
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-lg">{salon.name}</h3>
                    {salon.is_verified && (
                      <Badge variant="secondary" className="text-xs">Verified</Badge>
                    )}
                  </Flex>

                  {salon.address && (
                    <Flex gap="xs" align="start">
                      <MapPin className="h-3 w-3 text-muted-foreground mt-1" />
                      <p className="text-sm text-muted-foreground text-sm">{salon.address}</p>
                    </Flex>
                  )}

                  {typeof salon.average_rating === 'number' && (
                    <p className="text-sm text-muted-foreground text-sm">
                      ⭐ {salon.average_rating.toFixed(1)} ({salon.review_count || 0} reviews)
                    </p>
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
          <p className="leading-7 text-muted-foreground text-center py-8">
            No locations found for this chain
          </p>
        )}
      </Box>
    </Stack>
  )
}
