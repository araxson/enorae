import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Users } from 'lucide-react'
import type { StaffOverview } from './admin-overview-types'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

type StaffTabProps = {
  staff: StaffOverview[]
}

export function AdminOverviewStaffTab({ staff }: StaffTabProps) {
  if (staff.length === 0) {
    return (
      <Card>
        <CardHeader>
          <ItemGroup>
            <Item variant="muted">
              <ItemContent>
                <CardTitle>Staff performance</CardTitle>
                <CardDescription>
                  Experience levels and primary roles across salons.
                </CardDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Users aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No staff records found</EmptyTitle>
              <EmptyDescription>
                Staff performance metrics appear once teams are onboarded.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>Invite or sync staff to see role distribution and experience levels.</EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  const rows = staff.slice(0, 25)

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item variant="muted">
            <ItemContent>
              <CardTitle>Staff performance</CardTitle>
              <CardDescription>
                Experience levels and primary roles across salons.
              </CardDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80 pr-4">
          <ItemGroup>
            {rows.map((member) => (
              <Item key={member['id']} variant="outline" size="sm" className="flex-col gap-3">
                <ItemHeader>
                  <ItemTitle>{member['full_name'] || 'Unknown staff'}</ItemTitle>
                  <ItemActions>
                    <Badge variant="outline">
                      {(member['experience_years'] ?? 0).toLocaleString()} yrs
                    </Badge>
                  </ItemActions>
                </ItemHeader>
                <ItemContent>
                  <ItemDescription>
                    {member['salon_name'] || 'Unknown salon'}
                  </ItemDescription>
                  <ItemDescription className="capitalize">
                    {member['title'] || member['staff_role'] || 'Staff'}
                  </ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
