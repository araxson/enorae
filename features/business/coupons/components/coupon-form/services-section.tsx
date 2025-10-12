import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

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
    <div>
      <Label>Applicable Services</Label>
      <div className="mt-2 rounded-md border p-3 space-y-2 max-h-48 overflow-y-auto">
        {services.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active services available</p>
        ) : (
          services.map((service) => (
            <label
              key={service.id}
              className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-muted/50"
            >
              <span className="text-sm">{service.name}</span>
              <Checkbox
                checked={selectedServiceIds.has(service.id)}
                onCheckedChange={(checked) => onToggleService(service.id, Boolean(checked))}
              />
            </label>
          ))
        )}
      </div>
    </div>
  )
}
