'use client'

import { Users } from 'lucide-react'
import type { StaffLeader } from '../../api/types'
import { formatCurrency } from './utils'
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

export function StaffLeadersCard({ staffPerformance }: { staffPerformance: StaffLeader[] }) {
  return (
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader className="items-center gap-2">
        <Users className="size-5" />
        <ItemTitle>Staff Leaders by Service</ItemTitle>
      </ItemHeader>
      <ItemContent className="space-y-3">
        <ItemGroup className="space-y-3">
          {staffPerformance.map((record) => (
            <Item key={record.service_id} variant="outline" className="flex-col gap-2">
              <ItemHeader className="pb-0">
                <ItemTitle>{record.service_name}</ItemTitle>
              </ItemHeader>
              <ItemContent className="space-y-1">
                {record.staff.slice(0, 3).map((staff: { staff_id: string; staff_name: string; appointmentCount: number; revenue: number }) => (
                  <div key={staff.staff_id} className="flex justify-between">
                    <p className="text-sm text-foreground">{staff.staff_name}</p>
                    <p>
                      {staff.appointmentCount} appts · {formatCurrency(staff.revenue)}
                    </p>
                  </div>
                ))}
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      </ItemContent>
    </Item>
  )
}
