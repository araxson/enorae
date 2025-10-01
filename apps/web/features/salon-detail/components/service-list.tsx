import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@enorae/ui'
import { Button } from '@enorae/ui'
import type { Service } from '../types/salon.types'

interface ServiceListProps {
  services: Service[]
  salonSlug: string
}

export function ServiceList({ services, salonSlug }: ServiceListProps) {
  if (services.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No services available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Services</h2>
      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{service.name}</CardTitle>
                  {service.description && (
                    <CardDescription>{service.description}</CardDescription>
                  )}
                  {service.category_name && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {service.category_name}
                    </p>
                  )}
                </div>
                {service.is_bookable && (
                  <Button asChild>
                    <a href={`/book/${salonSlug}?service=${service.id}`}>
                      Book Now
                    </a>
                  </Button>
                )}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}