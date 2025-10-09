import { Grid } from '@/components/layout'
import type { ReactNode } from 'react'

interface MetricsGridProps {
  children: ReactNode
  /**
   * Maximum number of columns to display
   * @default 4
   */
  maxColumns?: 2 | 3 | 4
  /**
   * Gap between grid items
   * @default 'lg'
   */
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * Standardized grid layout for dashboard metrics
 *
 * Provides consistent responsive breakpoints across all dashboards:
 * - Mobile (base): 1 column
 * - Tablet (sm): 2 columns
 * - Desktop (lg): 3-4 columns based on maxColumns
 *
 * @example
 * ```tsx
 * <MetricsGrid maxColumns={4}>
 *   <StatCard label="Total Salons" value={100} />
 *   <StatCard label="Total Users" value={500} />
 *   <StatCard label="Active Appointments" value={50} />
 *   <StatCard label="Revenue" value="$10,000" />
 * </MetricsGrid>
 * ```
 */
export function MetricsGrid({ children, maxColumns = 4, gap = 'lg' }: MetricsGridProps) {
  // Determine grid columns based on maxColumns
  const cols = maxColumns === 4
    ? ({ base: 1, sm: 2, lg: 3, xl: 4 } as const)
    : maxColumns === 3
    ? ({ base: 1, sm: 2, lg: 3 } as const)
    : ({ base: 1, lg: 2 } as const)

  return (
    <Grid cols={cols} gap={gap}>
      {children}
    </Grid>
  )
}
