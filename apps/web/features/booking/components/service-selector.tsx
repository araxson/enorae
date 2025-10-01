'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@enorae/ui'
import { RadioGroup, RadioGroupItem } from '@enorae/ui'
import { Label } from '@enorae/ui'
import type { Service } from '../types/booking.types'

interface ServiceSelectorProps {
  services: Service[]
  selectedService?: string
  onSelectService: (serviceId: string) => void
}

export function ServiceSelector({
  services,
  selectedService,
  onSelectService
}: ServiceSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Service</CardTitle>
        <CardDescription>Choose the service you'd like to book</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedService} onValueChange={onSelectService}>
          <div className="space-y-3">
            {services.map((service) => (
              <div key={service.id} className="flex items-center space-x-2">
                <RadioGroupItem value={service.id!} id={service.id!} />
                <Label htmlFor={service.id!} className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">{service.name}</p>
                    {service.description && (
                      <p className="text-sm text-muted-foreground">
                        {service.description}
                      </p>
                    )}
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}