import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

type Service = Database['public']['Views']['services_view']['Row']

interface ServiceListProps {
  services: Service[]
}

export function ServiceList({ services }: ServiceListProps) {
  if (services.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Clock className="size-6" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No services available</EmptyTitle>
              <EmptyDescription>
                Check back soon for the latest offerings from this salon.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item>
            <ItemContent>
              <CardTitle>Services</CardTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full space-y-2">
          {services.map((service, index) => (
            <AccordionItem key={service['id'] || ''} value={`service-${index}`}>
              <AccordionTrigger>
                <ItemGroup className="w-full px-4 py-3">
                  <Item variant="muted" size="sm" className="w-full flex-col sm:flex-row sm:items-center sm:justify-between">
                    <ItemContent>
                      <ItemTitle>{service['name'] || 'Service'}</ItemTitle>
                    </ItemContent>
                    {service['category_name'] ? (
                      <ItemActions className="flex-none">
                        <Badge variant="secondary">{service['category_name']}</Badge>
                      </ItemActions>
                    ) : null}
                  </Item>
                </ItemGroup>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                <ItemGroup className="gap-4">
                  {service['description'] ? (
                    <Item>
                      <ItemContent>
                        <ItemDescription>{service['description']}</ItemDescription>
                      </ItemContent>
                    </Item>
                  ) : null}
                  <Item>
                    <ItemContent>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {service['duration_minutes'] ? (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="size-4" aria-hidden="true" />
                            <Badge variant="outline">{service['duration_minutes']} min</Badge>
                          </div>
                        ) : null}
                        <Button size="sm">Book now</Button>
                      </div>
                    </ItemContent>
                  </Item>
                </ItemGroup>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
