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
 *   <Card>
 *     <CardHeader className="flex items-center justify-between pb-2">
 *       <CardTitle>Total Salons</CardTitle>
 *       <Building2 className="h-4 w-4" aria-hidden />
 *     </CardHeader>
 *     <CardContent>
 *       <CardTitle>100</CardTitle>
 *     </CardContent>
 *   </Card>
 *   // additional cards...
 * </MetricsGrid>
 * ```
 */
export function MetricsGrid({ children, maxColumns = 4, gap = 'lg' }: MetricsGridProps) {
  const columnClasses =
    maxColumns === 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      : maxColumns === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 lg:grid-cols-2'

  const gapClasses: Record<NonNullable<MetricsGridProps['gap']>, string> = {
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  }

  return <div className={['grid', columnClasses, gapClasses[gap]].join(' ')}>{children}</div>
}
