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
            <CardHeader className="pb-2">
              <CardTitle>{record.service_name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 pt-0">
              {record.staff.slice(0, 3).map((staff) => (
                <div key={staff.staff_id} className="flex justify-between">
                  <p className="text-sm text-foreground">{staff.staff_name}</p>
                  <p>
                    {staff.appointmentCount} appts · {formatCurrency(staff.revenue)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </CardContent>
  </Card>
)
}
