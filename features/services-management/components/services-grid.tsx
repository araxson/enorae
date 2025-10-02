import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Grid, Stack, Flex, Group } from '@/components/layout'
import { H4, P, Muted } from '@/components/ui/typography'
import { Clock } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type Service = Database['public']['Views']['services']['Row']

interface ServicesGridProps {
  services: Service[]
}

export function ServicesGrid({ services }: ServicesGridProps) {
  return (
    <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
      {services.map((service) => (
        <Card key={service.id}>
          <CardHeader>
            <Flex align="start" justify="between" gap="sm">
              <CardTitle className="text-base">{service.name}</CardTitle>
              <Badge variant={service.is_active ? 'default' : 'secondary'}>
                {service.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </Flex>
          </CardHeader>

          <CardContent>
            <Stack gap="sm">
              {service.description && (
                <P className="text-muted-foreground line-clamp-2">
                  {service.description}
                </P>
              )}

              {service.category_name && (
                <Muted>{service.category_name}</Muted>
              )}
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Grid>
  )
}
