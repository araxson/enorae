import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { StaffOverview } from './admin-overview-types'

type StaffTabProps = {
  staff: StaffOverview[]
}

export function AdminOverviewStaffTab({ staff }: StaffTabProps) {
  if (staff.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Staff performance</CardTitle>
          <CardDescription>
            Experience levels and primary roles across salons.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No staff records found.</p>
        </CardContent>
      </Card>
    )
  }

  const rows = staff.slice(0, 25)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff performance</CardTitle>
        <CardDescription>
          Experience levels and primary roles across salons.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80 pr-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden xl:table-cell">Salon</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Experience</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    {member.full_name || 'Unknown staff'}
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground xl:table-cell">
                    {member.salon_name || 'Unknown salon'}
                  </TableCell>
                  <TableCell className="capitalize text-sm text-muted-foreground">
                    {member.title || member.staff_role || 'Staff'}
                  </TableCell>
                  <TableCell className="text-right text-sm font-semibold">
                    {member.experience_years ?? 0} yrs
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
