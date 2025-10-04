import { Card, CardContent } from '@/components/ui/card'
import { Stack, Group, Box } from '@/components/layout'
import { H1, P, Muted } from '@/components/ui/typography'
import { MapPin } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type Salon = Database['public']['Views']['salons']['Row']

interface SalonHeaderProps {
  salon: Salon
}

export function SalonHeader({ salon }: SalonHeaderProps) {
  return (
    <Card>
      <CardContent>
        <Box pt="md">
          <Stack gap="md">
            <Box>
              <H1>{salon.name}</H1>
              {salon.business_type && <P className="mt-2">{salon.business_type}</P>}
            </Box>

            <Stack gap="sm">
              {salon.business_name && (
                <Group gap="sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Muted>{salon.business_name}</Muted>
                </Group>
              )}
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}
