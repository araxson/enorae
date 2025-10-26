'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { StaffWithMetrics } from '@/features/admin/staff/api/queries'
import { StaffRiskBadge } from './staff-risk-badge'
import { formatDate } from '@/lib/utils/date-time'

function renderBackgroundBadge(status: StaffWithMetrics['background']['status']) {
  switch (status) {
    case 'clear':
      return <Badge variant="outline">Clear</Badge>
    case 'pending':
      return <Badge variant="secondary">Pending</Badge>
    case 'failed':
      return <Badge variant="destructive">Failed</Badge>
    default:
      return <Badge variant="secondary">Missing</Badge>
  }
}

const formatLabel = (value?: string | null) =>
  value
    ? value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
    : '—'

type StaffTableProps = {
  staff: StaffWithMetrics[]
}

export function StaffTable({ staff }: StaffTableProps) {
  if (staff.length === 0) {
    return (
      <Alert>
        <AlertTitle>No staff records found</AlertTitle>
        <AlertDescription>
          Adjust your filters to see staff results.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <>
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>Staff Directory</CardTitle>
          <CardDescription>Staff profiles with verification and performance metrics.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
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
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{member.fullName || member.title || 'Unnamed staff'}</span>
                    <span className="text-xs text-muted-foreground">
                      Experience: {member.experienceYears} yrs
                    </span>
                    {member.metrics.lastAppointmentAt && (
                      <span className="text-xs text-muted-foreground">
                        Last appointment: {formatDate(member.metrics.lastAppointmentAt)}
                      </span>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <Badge variant="outline">{formatLabel(member.staffRole)}</Badge>
                    {member.title && (
                      <span className="block text-xs text-muted-foreground">{member.title}</span>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <span className="text-sm font-medium">{member.salonName || '—'}</span>
                    {member.salonSlug && (
                      <span className="text-xs text-muted-foreground">{member.salonSlug}</span>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    {renderBackgroundBadge(member.background.status)}
                    <span className="block text-xs text-muted-foreground">
                      Checked {formatDate(member.background.lastCheckedAt)}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <Badge variant="secondary">{member.certifications.length}</Badge>
                    {member.certifications.slice(0, 2).map((certification) => {
                      const label = certification.replace(/^cert:/i, '')
                      return (
                        <span
                          key={certification}
                          className="block text-xs text-muted-foreground truncate"
                          title={label}
                        >
                          {label}
                        </span>
                      )
                    })}
                    {member.certifications.length > 2 && (
                      <span className="text-xs text-muted-foreground">+{member.certifications.length - 2} more</span>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <span className="text-sm font-semibold">
                      {member.metrics.completedAppointments}/{member.metrics.totalAppointments} completed
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      No-shows{' '}
                      {member.compliance.noShowRate > 0
                        ? `${Math.round(member.compliance.noShowRate * 100)}%`
                        : '0%'}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Avg rating {member.metrics.averageRating ? member.metrics.averageRating.toFixed(2) : '—'}
                    </span>
                  </div>
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
          </Table>
        </CardContent>
      </Card>

      <div className="space-y-4 md:hidden">
        {staff.map((member) => (
          <Card key={member.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>{member.fullName || member.title || 'Unnamed staff'}</CardTitle>
                  <CardDescription>Experience {member.experienceYears} yrs</CardDescription>
                  {member.metrics.lastAppointmentAt ? (
                    <CardDescription>
                      Last appointment {formatDate(member.metrics.lastAppointmentAt)}
                    </CardDescription>
                  ) : null}
                </div>
                <StaffRiskBadge staff={member} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="block font-medium">Role</span>
                  <span className="text-muted-foreground capitalize">
                    {member.staffRole?.replace(/_/g, ' ') || '—'}
                  </span>
                </div>
                <div>
                  <span className="block font-medium">Salon</span>
                  <span className="text-muted-foreground" title={member.salonName ?? undefined}>
                    {member.salonName || '—'}
                  </span>
                </div>
                <div>
                  <span className="block font-medium">Background</span>
                  {renderBackgroundBadge(member.background.status)}
                  <span className="block text-xs text-muted-foreground">
                    Checked {formatDate(member.background.lastCheckedAt)}
                  </span>
                </div>
                <div>
                  <span className="block font-medium">Certifications</span>
                  <Badge variant="secondary">{member.certifications.length}</Badge>
                  {member.certifications.slice(0, 2).map((certification) => {
                    const label = certification.replace(/^cert:/i, '')
                    return (
                      <span
                        key={certification}
                        className="block truncate text-xs text-muted-foreground"
                        title={label}
                      >
                        {label}
                      </span>
                    )
                  })}
                  {member.certifications.length > 2 && (
                    <span className="text-xs text-muted-foreground">+{member.certifications.length - 2} more</span>
                  )}
                </div>
                <div>
                  <span className="block font-medium">Performance</span>
                  <span className="block text-xs text-muted-foreground">
                    {member.metrics.completedAppointments}/{member.metrics.totalAppointments} completed
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    No-shows{' '}
                    {member.compliance.noShowRate > 0
                      ? `${Math.round(member.compliance.noShowRate * 100)}%`
                      : '0%'}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    Avg rating {member.metrics.averageRating ? member.metrics.averageRating.toFixed(2) : '—'}
                  </span>
                </div>
                <div>
                  <span className="block font-medium">Compliance</span>
                  <span className="block text-xs text-muted-foreground">
                    Score {member.compliance.score}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    Completion {Math.round(member.compliance.completionRate * 100)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
