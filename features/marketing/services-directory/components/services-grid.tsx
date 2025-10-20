import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Grid, Stack, Box, Group } from '@/components/layout'
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
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">No services found</h3>
          <p className="text-sm text-muted-foreground">
            {categoryName
              ? `No services available in the ${categoryName} category`
              : 'Try browsing different categories to find services'}
          </p>
        </Stack>
      </Box>
    )
  }

  return (
    <Stack gap="md">
      <p className="text-sm text-muted-foreground">
        {services.length} service{services.length !== 1 ? 's' : ''}
        {categoryName && ` in ${categoryName}`}
      </p>
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
            <p className="leading-7 text-muted-foreground text-sm line-clamp-3">{service.description}</p>
          )}

          <Stack gap="sm">
            {/* Duration */}
            {service.duration_minutes && (
              <Group gap="xs">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <small className="text-sm font-medium leading-none text-muted-foreground">
                  {service.duration_minutes} minutes
                </small>
              </Group>
            )}

            {/* Price */}
            {hasPrice && (
              <Group gap="xs">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <Group gap="sm" align="center">
                  {hasSalePrice ? (
                    <>
                      <small className="text-sm font-medium leading-none line-through text-muted-foreground">
                        ${service.current_price?.toFixed(2)}
                      </small>
                      <small className="text-sm font-medium leading-none font-semibold text-green-600">
                        ${service.sale_price?.toFixed(2)}
                      </small>
                      <Badge variant="destructive" className="text-xs">
                        Sale
                      </Badge>
                    </>
                  ) : (
                    <small className="text-sm font-medium leading-none font-semibold">
                      ${service.current_price?.toFixed(2)}
                    </small>
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
