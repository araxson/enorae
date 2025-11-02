'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
} from '@/components/ui/item'

type StaffLeader = {
  service_id: string
  service_name: string
  staff: Array<{ staff_id: string; staff_name: string; appointmentCount: number; revenue: number }>
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export function StaffPerformanceSection({ staffPerformance }: { staffPerformance: StaffLeader[] }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {staffPerformance.map((record) => (
        <AccordionItem key={record.service_id} value={record.service_id}>
          <AccordionTrigger>{record.service_name}</AccordionTrigger>
          <AccordionContent className="space-y-1 text-muted-foreground">
            <ItemGroup>
              {record.staff.slice(0, 3).map((staff) => (
                <Item key={staff.staff_id}>
                  <ItemContent>
                    <ItemDescription>{staff.staff_name}</ItemDescription>
                  </ItemContent>
                  <ItemActions className="flex-none">
                    <ItemDescription>
                      {staff.appointmentCount} appts · {formatCurrency(staff.revenue)}
                    </ItemDescription>
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
