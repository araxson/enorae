import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { StaffWithMetrics } from '@/features/admin/staff/api/queries'
import { StaffRiskBadge } from './staff-risk-badge'
import { formatDate, renderBackgroundBadge } from './staff-table-helpers'

type StaffTableMobileProps = {
  staff: StaffWithMetrics[]
}

export function StaffTableMobile({ staff }: StaffTableMobileProps) {
  return (
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
          <CardContent className="space-y-3 pt-0">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="block font-medium">Role</span>
                <span className="capitalize text-muted-foreground">
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
                    <span key={certification} className="block truncate text-xs text-muted-foreground" title={label}>
                      {label}
                    </span>
                  )
                })}
              </div>
              <div>
                <span className="block font-medium">Performance</span>
                <span className="block text-muted-foreground">
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
                <span className="block font-medium">Compliance Score</span>
                <span className="text-muted-foreground">{member.compliance.score}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
