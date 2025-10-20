import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Stack, Flex, Group } from '@/components/layout'
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
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{category}</h3>
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
        <p className="leading-7 font-medium">{service.name}</p>
        {service.description && <p className="text-sm text-muted-foreground text-sm">{service.description}</p>}
      </Stack>
      <Group gap="sm" align="center">
        {service.duration_minutes && <p className="text-sm text-muted-foreground text-sm">{service.duration_minutes}m</p>}
        {service.sale_price && (
          <p className="leading-7 font-semibold whitespace-nowrap">${service.sale_price}</p>
        )}
      </Group>
    </Flex>
  )
}
