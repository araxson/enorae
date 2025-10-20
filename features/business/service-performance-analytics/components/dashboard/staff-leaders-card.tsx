'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users } from 'lucide-react'
import type { StaffLeader } from './types'
import { formatCurrency } from './utils'

export function StaffLeadersCard({ staffPerformance }: { staffPerformance: StaffLeader[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Staff Leaders by Service
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {staffPerformance.map((record) => (
          <div key={record.service_id} className="rounded-md border p-3">
            <p className="text-base font-medium mb-2">{record.service_name}</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              {record.staff.slice(0, 3).map((staff) => (
                <div key={staff.staff_id} className="flex justify-between">
                  <p className="text-base mt-0 text-sm text-foreground">{staff.staff_name}</p>
                  <p className="text-base mt-0 text-sm text-muted-foreground">
                    {staff.appointmentCount} appts · {formatCurrency(staff.revenue)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
