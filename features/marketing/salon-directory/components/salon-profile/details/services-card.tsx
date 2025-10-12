import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Stack, Flex, Group } from '@/components/layout'
import { H3, P, Muted } from '@/components/ui/typography'
import type { ServicesByCategory, Service } from '../types'

interface ServicesCardProps {
  services: Service[]
  servicesByCategory: ServicesByCategory
}

export function ServicesCard({ services, servicesByCategory }: ServicesCardProps) {
  if (services.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Services</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap="lg">
          {(Object.entries(servicesByCategory) as Array<[string, Service[]]>).map(
            ([category, categoryServices]) => (
              <Stack gap="md" key={category}>
                <H3>{category}</H3>
                <Stack gap="sm">
                  {categoryServices.map((service) => (
                    <ServiceRow key={service.id} service={service} />
                  ))}
                </Stack>
              </Stack>
            ),
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

interface ServiceRowProps {
  service: Service
}

function ServiceRow({ service }: ServiceRowProps) {
  return (
    <Flex justify="between" align="start" className="py-2">
      <Stack gap="xs">
        <P className="font-medium">{service.name}</P>
        {service.description && <Muted className="text-sm">{service.description}</Muted>}
      </Stack>
      <Group gap="sm" align="center">
        {service.duration_minutes && <Muted className="text-sm">{service.duration_minutes}m</Muted>}
        {service.sale_price && (
          <P className="font-semibold whitespace-nowrap">${service.sale_price}</P>
        )}
      </Group>
    </Flex>
  )
}
