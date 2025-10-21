'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users } from 'lucide-react'
import type { StaffLeader } from './types'
import { formatCurrency } from './utils'

export function StaffLeadersCard({ staffPerformance }: { staffPerformance: StaffLeader[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <CardTitle>Staff Leaders by Service</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      {staffPerformance.map((record) => (
        <Card key={record.service_id}>
          <CardContent className="space-y-2 p-4">
            <p className="mb-2 text-base font-medium">{record.service_name}</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              {record.staff.slice(0, 3).map((staff) => (
                <div key={staff.staff_id} className="flex justify-between">
                  <p className="text-sm text-foreground">{staff.staff_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {staff.appointmentCount} appts · {formatCurrency(staff.revenue)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </CardContent>
  </Card>
)
}
