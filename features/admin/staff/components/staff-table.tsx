'use client'

import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { StaffWithMetrics } from '../api/queries'
import { StaffRiskBadge } from './staff-risk-badge'

function formatDate(value: string | null) {
  if (!value) return '—'
  try {
    return format(new Date(value), 'MMM d, yyyy')
  } catch (error) {
    return '—'
  }
}

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

type StaffTableProps = {
  staff: StaffWithMetrics[]
}

export function StaffTable({ staff }: StaffTableProps) {
  if (staff.length === 0) {
    return (
      <div className="rounded-lg border py-12 text-center text-muted-foreground">
        No staff records found for the selected filters.
      </div>
    )
  }

  return (
    <div className="rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Staff member</TableHead>
            <TableHead className="min-w-[140px]">Role</TableHead>
            <TableHead className="min-w-[140px]">Salon</TableHead>
            <TableHead className="min-w-[120px]">Background</TableHead>
            <TableHead className="min-w-[120px]">Certifications</TableHead>
            <TableHead className="min-w-[160px]">Performance</TableHead>
            <TableHead className="min-w-[140px]">Compliance</TableHead>
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
                  <Badge variant="outline" className="capitalize">
                    {member.staffRole?.replace(/_/g, ' ') || '—'}
                  </Badge>
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
                  {member.certifications.slice(0, 2).map((certification) => (
                    <span key={certification} className="block text-xs text-muted-foreground truncate">
                      {certification.replace(/^cert:/i, '')}
                    </span>
                  ))}
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
                    No-shows {member.compliance.noShowRate > 0 ? `${Math.round(member.compliance.noShowRate * 100)}%` : '0%'}
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
    </div>
  )
}
