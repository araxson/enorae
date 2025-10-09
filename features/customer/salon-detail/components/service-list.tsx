import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { H6, P, Small } from '@/components/ui/typography'
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
        <CardContent className="py-10 text-center text-muted-foreground">
          No services available
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
        <Accordion type="multiple" className="w-full space-y-2">
          {services.map((service, index) => (
            <AccordionItem key={service.id || ''} value={`service-${index}`} className="border rounded-md">
              <AccordionTrigger className="px-4 py-3">
                <div className="flex flex-col gap-2 text-left sm:flex-row sm:items-center sm:justify-between">
                  <H6>{service.name || 'Service'}</H6>
                  {service.category_name && (
                    <Badge variant="secondary" className="w-fit">
                      {service.category_name}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                <div className="space-y-4">
                  {service.description && (
                    <P className="text-sm text-muted-foreground">{service.description}</P>
                  )}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {service.duration_minutes && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <Small>{service.duration_minutes} min</Small>
                      </div>
                    )}
                    <Button size="sm">Book now</Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
