import { Badge } from '@/components/ui/badge'
import type { StaffWithMetrics } from '@/features/admin/staff/api/queries'
import { formatDate } from '@/lib/utils/date-time'

export function renderBackgroundBadge(status: StaffWithMetrics['background']['status']) {
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

export function formatLabel(value?: string | null) {
  return value
    ? value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
    : '—'
}

type StaffInfoCellProps = {
  member: StaffWithMetrics
}

export function StaffInfoCell({ member }: StaffInfoCellProps) {
  return (
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
  )
}

type RoleCellProps = {
  member: StaffWithMetrics
}

export function RoleCell({ member }: RoleCellProps) {
  return (
    <div className="space-y-1">
      <Badge variant="outline">{formatLabel(member.staffRole)}</Badge>
      {member.title && (
        <span className="block text-xs text-muted-foreground">{member.title}</span>
      )}
    </div>
  )
}

type SalonCellProps = {
  member: StaffWithMetrics
}

export function SalonCell({ member }: SalonCellProps) {
  return (
    <div className="space-y-1">
      <span className="text-sm font-medium">{member.salonName || '—'}</span>
      {member.salonSlug && (
        <span className="text-xs text-muted-foreground">{member.salonSlug}</span>
      )}
    </div>
  )
}

type BackgroundCellProps = {
  member: StaffWithMetrics
}

export function BackgroundCell({ member }: BackgroundCellProps) {
  return (
    <div className="space-y-1">
      {renderBackgroundBadge(member.background.status)}
      <span className="block text-xs text-muted-foreground">
        Checked {formatDate(member.background.lastCheckedAt)}
      </span>
    </div>
  )
}

type CertificationsCellProps = {
  member: StaffWithMetrics
}

export function CertificationsCell({ member }: CertificationsCellProps) {
  return (
    <div className="space-y-1">
      <Badge variant="secondary">{member.certifications.length}</Badge>
      {member.certifications.slice(0, 2).map((certification: string) => {
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
  )
}

type PerformanceCellProps = {
  member: StaffWithMetrics
}

export function PerformanceCell({ member }: PerformanceCellProps) {
  return (
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
  )
}
