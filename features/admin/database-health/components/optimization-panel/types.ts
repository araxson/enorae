import type { OptimizationSnapshot } from '@/features/admin/database-health/api/queries'

/**
 * Optimization panel component props
 */
export interface OptimizationPanelProps {
  data: OptimizationSnapshot
}
