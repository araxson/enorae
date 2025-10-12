import Image from 'next/image'
import Link from 'next/link'
import { Stack, Box, Flex, Group } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { H1, P, Muted, Large } from '@/components/ui/typography'
import { Star } from 'lucide-react'
import type { Salon } from './types'

interface SalonHeroProps {
  salon: Salon
}

export function SalonHero({ salon }: SalonHeroProps) {
  return (
    <Box>
      {salon.cover_image_url && (
        <div className="aspect-[21/9] w-full overflow-hidden rounded-lg bg-muted relative mb-6">
          <Image
            src={salon.cover_image_url}
            alt={salon.name || 'Salon'}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <Flex justify="between" align="start" className="flex-wrap gap-4">
        <Stack gap="md">
          <Group gap="md">
            {salon.logo_url && (
              <div className="h-20 w-20 overflow-hidden rounded-lg bg-muted relative">
                <Image src={salon.logo_url} alt={salon.name || 'Logo'} fill className="object-cover" />
              </div>
            )}
            <Stack gap="sm">
              <H1>{salon.name || 'Unnamed Salon'}</H1>
              {salon.rating !== null && (
                <Group gap="sm">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <Large className="font-semibold">{salon.rating.toFixed(1)}</Large>
                  {salon.review_count !== null && <Muted>({salon.review_count} reviews)</Muted>}
                </Group>
              )}
            </Stack>
          </Group>

          {salon.short_description && (
            <P className="text-muted-foreground">{salon.short_description}</P>
          )}
        </Stack>

        <Group gap="sm">
          <Button size="lg" asChild>
            <Link href="/signup">Book Appointment</Link>
          </Button>
          <Button size="lg" variant="outline">
            Share
          </Button>
        </Group>
      </Flex>
    </Box>
  )
}
