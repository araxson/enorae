import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import type { AdminSalon } from '@/features/admin/salons/api/queries'
import {
  RatingCell,
  StaffCell,
  ComplianceCell,
  LicenseCell,
  formatCreatedDate,
  formatRevenue,
} from './table-utilities'

type DesktopSalonsTableProps = {
  salons: AdminSalon[]
}

export function DesktopSalonsTable({ salons }: DesktopSalonsTableProps) {
  return (
    <Card>
      <CardContent>
        <div className="-m-6">
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Salon</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead>License</TableHead>
                  <TableHead>Health</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salons.map((salon) => (
                  <TableRow key={salon.id} className="hover:bg-accent/50">
                    <TableCell>
                      <div className="min-w-0">
                        <p className="font-medium">{salon.name}</p>
                      </div>
                    </TableCell>

                    <TableCell className="text-sm capitalize">salon</TableCell>

                    <TableCell>
                      <RatingCell salon={salon} />
                    </TableCell>

                    <TableCell className="text-sm font-medium">
                      {formatRevenue(salon.total_revenue)}
                    </TableCell>

                    <TableCell>
                      <StaffCell salon={salon} />
                    </TableCell>

                    <TableCell>
                      <ComplianceCell salon={salon} />
                    </TableCell>

                    <TableCell>
                      <LicenseCell salon={salon} />
                    </TableCell>

                    <TableCell>
                      <span className="text-sm font-semibold">{salon.healthScore}%</span>
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {formatCreatedDate(salon.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}
