import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Grid, Stack, Box, Group } from '@/components/layout'
import { H3, P, Muted, Small } from '@/components/ui/typography'
import type { Database } from '@/lib/types/database.types'
import { Clock, DollarSign, Sparkles } from 'lucide-react'

type Service = Database['public']['Views']['services']['Row']

interface ServicesGridProps {
  services: Service[]
  categoryName?: string
}

export function ServicesGrid({ services, categoryName }: ServicesGridProps) {
  if (services.length === 0) {
    return (
      <Box className="text-center py-12">
        <Stack gap="md">
          <H3>No services found</H3>
          <Muted>
            {categoryName
              ? `No services available in the ${categoryName} category`
              : 'Try browsing different categories to find services'}
          </Muted>
        </Stack>
      </Box>
    )
  }

  return (
    <Stack gap="md">
      <Muted>
        {services.length} service{services.length !== 1 ? 's' : ''}
        {categoryName && ` in ${categoryName}`}
      </Muted>
      <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </Grid>
    </Stack>
  )
}

interface ServiceCardProps {
  service: Service
}

function ServiceCard({ service }: ServiceCardProps) {
  const hasPrice = service.current_price !== null
  const hasSalePrice = service.sale_price !== null && service.sale_price < (service.current_price || 0)

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <Stack gap="sm">
          <Group gap="sm" className="flex-wrap">
            {service.category_name && (
              <Link href={`/services/${service.category_slug}`}>
                <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                  {service.category_name}
                </Badge>
              </Link>
            )}
            {service.is_featured && (
              <Badge variant="default" className="gap-1">
                <Sparkles className="h-3 w-3" />
                Featured
              </Badge>
            )}
          </Group>
          <CardTitle>{service.name}</CardTitle>
        </Stack>
      </CardHeader>

      <CardContent className="flex-1">
        <Stack gap="md">
          {service.description && (
            <P className="text-muted-foreground text-sm line-clamp-3">{service.description}</P>
          )}

          <Stack gap="sm">
            {/* Duration */}
            {service.duration_minutes && (
              <Group gap="xs">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Small className="text-muted-foreground">
                  {service.duration_minutes} minutes
                </Small>
              </Group>
            )}

            {/* Price */}
            {hasPrice && (
              <Group gap="xs">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <Group gap="sm" align="center">
                  {hasSalePrice ? (
                    <>
                      <Small className="line-through text-muted-foreground">
                        ${service.current_price?.toFixed(2)}
                      </Small>
                      <Small className="font-semibold text-green-600">
                        ${service.sale_price?.toFixed(2)}
                      </Small>
                      <Badge variant="destructive" className="text-xs">
                        Sale
                      </Badge>
                    </>
                  ) : (
                    <Small className="font-semibold">
                      ${service.current_price?.toFixed(2)}
                    </Small>
                  )}
                </Group>
              </Group>
            )}
          </Stack>
        </Stack>
      </CardContent>

      <CardFooter className="pt-0">
        <Button className="w-full" asChild>
          <Link href={`/services/${service.category_slug}`}>View Salons</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
