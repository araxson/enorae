/**
 * Grid Component
 *
 * CSS Grid layout component with responsive columns and gaps.
 * Supports fixed and auto-responsive layouts.
 */

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { GridCols, Spacing, ResponsiveValue } from '../types'
import { gapClasses, gridColsClasses } from '../utils/classes'
import { responsiveClasses } from '../utils/responsive'

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
  cols?: ResponsiveValue<GridCols> | 'auto'
  gap?: ResponsiveValue<Spacing>
  gapX?: ResponsiveValue<Spacing>
  gapY?: ResponsiveValue<Spacing>
  responsive?: boolean
  autoFit?: boolean
  autoFill?: boolean
  minChildWidth?: string
}

// Gap X classes
const gapXClasses = Object.fromEntries(
  Object.entries(gapClasses).map(([k, v]) => [k, v.replace('gap-', 'gap-x-')])
) as Record<Spacing, string>

// Gap Y classes
const gapYClasses = Object.fromEntries(
  Object.entries(gapClasses).map(([k, v]) => [k, v.replace('gap-', 'gap-y-')])
) as Record<Spacing, string>

// Responsive grid columns (for backward compatibility)
const responsiveGridCols: Record<GridCols, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
  6: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6',
  7: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-7',
  8: 'grid-cols-1 md:grid-cols-4 lg:grid-cols-8',
  9: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-9',
  10: 'grid-cols-1 md:grid-cols-5 lg:grid-cols-10',
  11: 'grid-cols-1 md:grid-cols-5 lg:grid-cols-11',
  12: 'grid-cols-1 md:grid-cols-6 lg:grid-cols-12',
}

function getResponsiveColsClass(cols: GridCols): string {
  return responsiveGridCols[cols]
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({
    as: Component = 'div',
    className,
    cols = 1,
    gap = 'md',
    gapX,
    gapY,
    responsive = true,
    autoFit = false,
    autoFill = false,
    minChildWidth = '250px',
    style,
    ...props
  }, ref) => {
    const useAutoGrid = autoFit || autoFill || cols === 'auto'

    const gridStyle = useAutoGrid
      ? {
          ...style,
          gridTemplateColumns: `repeat(${
            autoFit ? 'auto-fit' : autoFill ? 'auto-fill' : 'auto-fit'
          }, minmax(${minChildWidth}, 1fr))`
        }
      : style

    // Generate responsive classes if responsive is true and cols is a number
    let colsClass: string | undefined
    if (!useAutoGrid) {
      if (typeof cols === 'number') {
        // Use responsive or static classes
        colsClass = responsive
          ? getResponsiveColsClass(cols)
          : gridColsClasses[cols]
      } else if (typeof cols === 'object') {
        // It's a ResponsiveValue<GridCols>
        colsClass = responsiveClasses(cols, gridColsClasses)
      }
    }

    return (
      <Component
        ref={ref}
        style={gridStyle}
        className={cn(
          'grid',
          colsClass,
          // Use specific gap if provided, otherwise general gap
          gapX && responsiveClasses(gapX, gapXClasses),
          gapY && responsiveClasses(gapY, gapYClasses),
          !gapX && !gapY && gap && responsiveClasses(gap, gapClasses),
          className
        )}
        {...props}
      />
    )
  }
)

Grid.displayName = 'Grid'