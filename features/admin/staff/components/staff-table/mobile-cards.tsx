import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Item, ItemContent, ItemGroup } from '@/components/ui/item'
import type { StaffWithMetrics } from '@/features/admin/staff/api/queries'
import { StaffRiskBadge } from '../staff-risk-badge'
import { formatDate } from '@/lib/utils/date-time'
import { formatLabel, renderBackgroundBadge } from './table-cell-renderers'

type MobileStaffCardsProps = {
  staff: StaffWithMetrics[]
}

export function MobileStaffCards({ staff }: MobileStaffCardsProps) {
  return (
    <div className="space-y-4">
      {staff.map((member) => (
        <Card key={member.id}>
          <CardHeader>
            <div className="pb-2">
              <ItemGroup className="items-start justify-between gap-3">
                <Item variant="muted" className="items-start gap-2">
                  <ItemContent>
                    <CardTitle>{member.fullName || member.title || 'Unnamed staff'}</CardTitle>
                    <CardDescription>Experience {member.experienceYears} yrs</CardDescription>
                    {member.metrics.lastAppointmentAt ? (
                      <CardDescription>
                        Last appointment {formatDate(member.metrics.lastAppointmentAt)}
                      </CardDescription>
                    ) : null}
                  </ItemContent>
                </Item>
                <Item variant="muted">
                  <ItemContent>
                    <StaffRiskBadge staff={member} />
                  </ItemContent>
                </Item>
              </ItemGroup>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 pt-0">
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
                  {member.certifications.slice(0, 2).map((certification: string) => {
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
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
