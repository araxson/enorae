import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Item, ItemContent, ItemGroup } from '@/components/ui/item'
import type { StaffWithMetrics } from '@/features/admin/staff/api/queries'
import { StaffRiskBadge } from '../staff-risk-badge'
import {
  StaffInfoCell,
  RoleCell,
  SalonCell,
  BackgroundCell,
  CertificationsCell,
  PerformanceCell,
} from './table-cell-renderers'

type DesktopStaffTableProps = {
  staff: StaffWithMetrics[]
}

export function DesktopStaffTable({ staff }: DesktopStaffTableProps) {
  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item variant="muted">
            <ItemContent>
              <CardTitle>Staff Directory</CardTitle>
              <CardDescription>Staff profiles with verification and performance metrics.</CardDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <Table>
            <TableCaption>Directory of staff members with verification and performance status.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Staff member</TableHead>
                <TableHead className="w-36">Role</TableHead>
                <TableHead className="w-36">Salon</TableHead>
                <TableHead className="w-32">Background</TableHead>
                <TableHead className="w-32">Certifications</TableHead>
                <TableHead className="w-40">Performance</TableHead>
                <TableHead className="w-36">Compliance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <StaffInfoCell member={member} />
                  </TableCell>

                  <TableCell>
                    <RoleCell member={member} />
                  </TableCell>

                  <TableCell>
                    <SalonCell member={member} />
                  </TableCell>

                  <TableCell>
                    <BackgroundCell member={member} />
                  </TableCell>

                  <TableCell>
                    <CertificationsCell member={member} />
                  </TableCell>

                  <TableCell>
                    <PerformanceCell member={member} />
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <StaffRiskBadge staff={member} />
                      <span className="block text-xs text-muted-foreground">
                        Score {member.compliance.score}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        Completion {Math.round(member.compliance.completionRate * 100)}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7}>
                  <span className="text-sm text-muted-foreground">
                    Total staff profiles: {staff.length}
                  </span>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
