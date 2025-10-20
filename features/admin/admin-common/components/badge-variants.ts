import type { VariantProps } from 'class-variance-authority'
import { badgeVariants } from '@/components/ui/badge'

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>

export const COMPLIANCE_BADGE_VARIANT: Record<'low' | 'medium' | 'high', BadgeVariant> = {
  low: 'default',
  medium: 'secondary',
  high: 'destructive',
}

export const LICENSE_BADGE_VARIANT: Record<'valid' | 'expiring' | 'expired' | 'unknown', BadgeVariant> = {
  valid: 'default',
  expiring: 'secondary',
  expired: 'destructive',
  unknown: 'outline',
}

export const APPOINTMENT_STATUS_BADGE_VARIANT: Record<string, BadgeVariant> = {
  completed: 'default',
  confirmed: 'default',
  scheduled: 'secondary',
  pending: 'secondary',
  cancelled: 'destructive',
  no_show: 'destructive',
}

export const STATUS_BADGE_VARIANT: Record<string, BadgeVariant> = {
  active: 'default',
  inactive: 'secondary',
  suspended: 'destructive',
  pending: 'secondary',
  resolved: 'default',
  closed: 'outline',
  archived: 'outline',
}

export const PRIORITY_BADGE_VARIANT: Record<string, BadgeVariant> = {
  urgent: 'destructive',
  high: 'default',
  normal: 'secondary',
  low: 'outline',
}
