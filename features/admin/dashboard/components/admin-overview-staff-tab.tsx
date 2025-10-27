import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { StaffOverview } from './admin-overview-types'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
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
              <EmptyTitle>No staff records found</EmptyTitle>
              <EmptyDescription>Staff performance metrics appear once teams are onboarded.</EmptyDescription>
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
          <ItemGroup className="space-y-3">
            {rows.map((member) => (
              <Item key={member['id']} variant="outline" className="flex-col gap-3">
                <ItemContent>
                  <ItemGroup>
                    <Item variant="muted">
                      <ItemContent>
                        <ItemTitle>{member['full_name'] || 'Unknown staff'}</ItemTitle>
                        <ItemDescription>
                          {member['salon_name'] || 'Unknown salon'}
                        </ItemDescription>
                        <ItemDescription className="capitalize text-sm text-muted-foreground">
                          {member['title'] || member['staff_role'] || 'Staff'}
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                    <Item variant="muted">
                      <ItemContent>
                        <ItemDescription>
                          {member['experience_years'] ?? 0} yrs experience
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                  </ItemGroup>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
