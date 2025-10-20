import Image from 'next/image'
import Link from 'next/link'
import { Stack, Box, Flex, Group } from '@/components/layout'
import { Button } from '@/components/ui/button'
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
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">{salon.name || 'Unnamed Salon'}</h1>
              {salon.rating !== null && (
                <Group gap="sm">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold font-semibold">{salon.rating.toFixed(1)}</span>
                  {salon.review_count !== null && <p className="text-sm text-muted-foreground">({salon.review_count} reviews)</p>}
                </Group>
              )}
            </Stack>
          </Group>

          {salon.short_description && (
            <p className="leading-7 text-muted-foreground">{salon.short_description}</p>
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
