import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Stack, Group, Flex, Box } from '@/components/layout'
import { H6, P, Muted, Small } from '@/components/ui/typography'
import { Clock } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type Service = Database['public']['Views']['services']['Row']

interface ServiceListProps {
  services: Service[]
}

export function ServiceList({ services }: ServiceListProps) {
  if (services.length === 0) {
    return (
      <Card>
        <CardContent>
          <Box pt="md">
            <Muted>No services available</Muted>
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Services</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {services.map((service, index) => (
            <AccordionItem key={service.id || ''} value={`service-${index}`}>
              <AccordionTrigger className="hover:no-underline">
                <Flex className="flex-1" justify="between" align="center" gap="md">
                  <H6>{service.name || 'Service'}</H6>
                  {service.category_name && (
                    <Badge variant="secondary">
                      {service.category_name}
                    </Badge>
                  )}
                </Flex>
              </AccordionTrigger>
              <AccordionContent>
                <Box pt="xs">
                  <Stack gap="md">
                    {service.description && (
                      <P className="text-muted-foreground">{service.description}</P>
                    )}
                    <Flex justify="between" align="center">
                      {service.duration_minutes && (
                        <Group gap="xs">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <Small className="text-muted-foreground">{service.duration_minutes} min</Small>
                        </Group>
                      )}
                      <Button size="sm">Book Now</Button>
                    </Flex>
                  </Stack>
                </Box>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
