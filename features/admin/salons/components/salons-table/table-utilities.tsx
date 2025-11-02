import { Badge } from '@/components/ui/badge'
import { Users } from 'lucide-react'
import { format } from 'date-fns'
import { COMPLIANCE_BADGE_VARIANT, LICENSE_BADGE_VARIANT } from '@/features/admin/admin-common/constants/badge-variants'
import type { AdminSalon } from '@/features/admin/salons/api/queries'

export function RatingCell({ salon }: { salon: AdminSalon }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-medium">
        {salon.rating_average ? salon.rating_average.toFixed(1) : 'N/A'}
      </span>
      {salon.rating_count && (
        <span className="text-xs text-muted-foreground">{salon.rating_count} reviews</span>
      )}
    </div>
  )
}

export function StaffCell({ salon }: { salon: AdminSalon }) {
  return (
    <>
      <div className="flex items-center gap-1">
        <Users className="size-3 text-muted-foreground" />
        <span className="text-sm">{salon.staff_count || 0}</span>
      </div>
      {salon.staffCapacityRatio > 1 && (
        <span className="text-xs text-destructive">Over capacity</span>
      )}
    </>
  )
}

export function ComplianceCell({ salon }: { salon: AdminSalon }) {
  return (
    <>
      <Badge
        variant={
          COMPLIANCE_BADGE_VARIANT[
            salon.complianceLevel as keyof typeof COMPLIANCE_BADGE_VARIANT
          ]
        }
      >
        {salon.complianceScore}
      </Badge>
      {salon.complianceIssues.length > 0 && (
        <p
          className="text-xs text-muted-foreground"
          title={salon.complianceIssues.join(', ')}
        >
          {salon.complianceIssues.slice(0, 2).join(', ')}
          {salon.complianceIssues.length > 2 && '…'}
        </p>
      )}
    </>
  )
}

export function LicenseCell({ salon }: { salon: AdminSalon }) {
  return (
    <>
      <Badge
        variant={
          LICENSE_BADGE_VARIANT[
            salon.licenseStatus as keyof typeof LICENSE_BADGE_VARIANT
          ]
        }
      >
        {salon.licenseStatus}
      </Badge>
      {salon.licenseDaysRemaining !== null && (
        <p className="text-xs text-muted-foreground">
          {salon.licenseDaysRemaining >= 0
            ? `${salon.licenseDaysRemaining} days`
            : `${Math.abs(salon.licenseDaysRemaining)} days overdue`}
        </p>
      )}
    </>
  )
}

export function formatCreatedDate(dateString?: string | null) {
  return dateString ? format(new Date(dateString), 'MMM dd, yyyy') : 'N/A'
}

export function formatRevenue(revenue?: string | number | null) {
  return revenue ? `$${Number(revenue).toLocaleString()}` : '$0'
}
