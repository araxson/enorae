import 'server-only'

import { createOperationLogger } from '@/lib/observability'
import {
  COMPLIANCE_BADGE_VARIANT,
  LICENSE_BADGE_VARIANT,
  APPOINTMENT_STATUS_BADGE_VARIANT,
  STATUS_BADGE_VARIANT,
  PRIORITY_BADGE_VARIANT,
} from '@/features/admin/common/constants/badge-variants'

export function getAdminBadgeVariantConfig() {
  return {
    compliance: COMPLIANCE_BADGE_VARIANT,
    license: LICENSE_BADGE_VARIANT,
    appointment: APPOINTMENT_STATUS_BADGE_VARIANT,
    status: STATUS_BADGE_VARIANT,
    priority: PRIORITY_BADGE_VARIANT,
  }
}
