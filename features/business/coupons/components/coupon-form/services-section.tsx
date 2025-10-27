import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface CouponServicesSectionProps {
  services: { id: string; name: string }[]
  selectedServiceIds: Set<string>
  onToggleService: (serviceId: string, checked: boolean) => void
}

export function CouponServicesSection({
  services,
  selectedServiceIds,
  onToggleService,
}: CouponServicesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Applicable services</CardTitle>
      </CardHeader>
      <CardContent>
        {services.length === 0 ? (
          <Alert>
            <AlertTitle>No active services</AlertTitle>
            <AlertDescription>Select services once they are available.</AlertDescription>
          </Alert>
        ) : (
          <ScrollArea className="max-h-48">
            <div className="space-y-2 pr-2">
              {services.map((service) => {
                const checkboxId = `coupon-service-${service.id}`
                return (
                  <div key={service.id} className="flex items-center justify-between rounded-md px-2 py-1">
                    <Label htmlFor={checkboxId}>
                      {service.name}
                    </Label>
                    <Checkbox
                      id={checkboxId}
                      checked={selectedServiceIds.has(service.id)}
                      onCheckedChange={(checked) => onToggleService(service.id, Boolean(checked))}
                    />
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
