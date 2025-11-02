'use client'

import { Separator } from '@/components/ui/separator'
import type { AppointmentServiceDetails } from '@/features/business/appointments/api/queries'

interface ServicesSummaryProps {
  services: AppointmentServiceDetails[]
}

export function ServicesSummary({ services }: ServicesSummaryProps) {
  const formatCurrency = (amount: number | null) => {
    if (!amount) return '$0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const totalPrice = 0
  const totalDuration = services.reduce(
    (sum, service) => sum + (service['duration_minutes'] || 0),
    0
  )

  return (
    <>
      <Separator className="mt-6" />
      <div className="flex justify-between items-center pt-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Total Services: {services.length}
          </p>
          <p className="text-sm text-muted-foreground">
            Total Duration: {totalDuration} minutes
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Price</p>
          <p className="text-2xl font-semibold leading-none tracking-tight">
            {formatCurrency(totalPrice)}
          </p>
        </div>
      </div>
    </>
  )
}
