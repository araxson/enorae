import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Item, ItemActions, ItemContent, ItemGroup, ItemTitle } from '@/components/ui/item'
import { Scissors } from 'lucide-react'

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
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Scissors className="h-8 w-8" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No active services</EmptyTitle>
              <EmptyDescription>Select services once they are available.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ScrollArea className="max-h-48">
            <ItemGroup className="space-y-2 pr-2">
              {services.map((service) => {
                const checkboxId = `coupon-service-${service.id}`
                return (
                  <Item key={service.id} className="rounded-md px-2 py-1">
                    <ItemContent>
                      <ItemTitle>
                        <Label htmlFor={checkboxId}>{service.name}</Label>
                      </ItemTitle>
                    </ItemContent>
                    <ItemActions>
                      <div className="flex-none">
                        <Checkbox
                          id={checkboxId}
                          checked={selectedServiceIds.has(service.id)}
                          onCheckedChange={(checked) => onToggleService(service.id, Boolean(checked))}
                        />
                      </div>
                    </ItemActions>
                  </Item>
                )
              })}
            </ItemGroup>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
