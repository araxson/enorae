import { Badge } from '@/components/ui/badge'
import type { StaffWithMetrics } from '@/features/admin/staff/api/queries'
import { StaffRiskBadge } from './staff-risk-badge'
import { formatDate, renderBackgroundBadge } from './staff-table-helpers'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

type StaffTableMobileProps = {
  staff: StaffWithMetrics[]
}

export function StaffTableMobile({ staff }: StaffTableMobileProps) {
  return (
    <ItemGroup className="space-y-4 md:hidden">
      {staff.map((member) => (
        <Item key={member.id} variant="outline" className="flex-col gap-3">
          <ItemContent className="w-full gap-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <ItemTitle>{member.fullName || member.title || 'Unnamed staff'}</ItemTitle>
                <ItemDescription>Experience {member.experienceYears} yrs</ItemDescription>
                {member.metrics.lastAppointmentAt ? (
                  <ItemDescription>
                    Last appointment {formatDate(member.metrics.lastAppointmentAt)}
                  </ItemDescription>
                ) : null}
              </div>
              <StaffRiskBadge staff={member} />
            </div>

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
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  )
}
