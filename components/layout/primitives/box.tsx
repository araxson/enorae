/**
 * Box Component
 *
 * The most primitive layout component. All other layout components are built on top of Box.
 * Provides spacing, display, position, and overflow control.
 */

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type {
  Spacing,
  ResponsiveValue,
  Display,
  Position,
  Overflow
} from '../types'
import {
  paddingClasses,
  marginClasses,
  displayClasses,
  positionClasses,
  overflowClasses
} from '../utils/classes'
import { responsiveClasses } from '../utils/responsive'

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
  // Spacing
  p?: ResponsiveValue<Spacing>
  px?: ResponsiveValue<Spacing>
  py?: ResponsiveValue<Spacing>
  pt?: ResponsiveValue<Spacing>
  pr?: ResponsiveValue<Spacing>
  pb?: ResponsiveValue<Spacing>
  pl?: ResponsiveValue<Spacing>
  m?: ResponsiveValue<Spacing>
  mx?: ResponsiveValue<Spacing>
  my?: ResponsiveValue<Spacing>
  mt?: ResponsiveValue<Spacing>
  mr?: ResponsiveValue<Spacing>
  mb?: ResponsiveValue<Spacing>
  ml?: ResponsiveValue<Spacing>
  // Layout
  display?: ResponsiveValue<Display>
  position?: Position
  inset?: boolean
  overflow?: Overflow
  overflowX?: Overflow
  overflowY?: Overflow
  // Sizing (string values for custom widths/heights)
  width?: string
  height?: string
}

// Generate specific spacing classes
const pxClasses = Object.fromEntries(
  Object.entries(paddingClasses).map(([k, v]) => [k, v.replace('p-', 'px-')])
) as Record<Spacing, string>

const pyClasses = Object.fromEntries(
  Object.entries(paddingClasses).map(([k, v]) => [k, v.replace('p-', 'py-')])
) as Record<Spacing, string>

const ptClasses = Object.fromEntries(
  Object.entries(paddingClasses).map(([k, v]) => [k, v.replace('p-', 'pt-')])
) as Record<Spacing, string>

const prClasses = Object.fromEntries(
  Object.entries(paddingClasses).map(([k, v]) => [k, v.replace('p-', 'pr-')])
) as Record<Spacing, string>

const pbClasses = Object.fromEntries(
  Object.entries(paddingClasses).map(([k, v]) => [k, v.replace('p-', 'pb-')])
) as Record<Spacing, string>

const plClasses = Object.fromEntries(
  Object.entries(paddingClasses).map(([k, v]) => [k, v.replace('p-', 'pl-')])
) as Record<Spacing, string>

const mxClasses = Object.fromEntries(
  Object.entries(marginClasses).map(([k, v]) => [k, v.replace('m-', 'mx-')])
) as Record<Spacing, string>

const myClasses = Object.fromEntries(
  Object.entries(marginClasses).map(([k, v]) => [k, v.replace('m-', 'my-')])
) as Record<Spacing, string>

const mtClasses = Object.fromEntries(
  Object.entries(marginClasses).map(([k, v]) => [k, v.replace('m-', 'mt-')])
) as Record<Spacing, string>

const mrClasses = Object.fromEntries(
  Object.entries(marginClasses).map(([k, v]) => [k, v.replace('m-', 'mr-')])
) as Record<Spacing, string>

const mbClasses = Object.fromEntries(
  Object.entries(marginClasses).map(([k, v]) => [k, v.replace('m-', 'mb-')])
) as Record<Spacing, string>

const mlClasses = Object.fromEntries(
  Object.entries(marginClasses).map(([k, v]) => [k, v.replace('m-', 'ml-')])
) as Record<Spacing, string>

const overflowXClasses = Object.fromEntries(
  Object.entries(overflowClasses).map(([k, v]) => [k, v.replace('overflow-', 'overflow-x-')])
) as Record<Overflow, string>

const overflowYClasses = Object.fromEntries(
  Object.entries(overflowClasses).map(([k, v]) => [k, v.replace('overflow-', 'overflow-y-')])
) as Record<Overflow, string>

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  ({
    as: Component = 'div',
    className,
    p, px, py, pt, pr, pb, pl,
    m, mx, my, mt, mr, mb, ml,
    display,
    position,
    inset,
    overflow,
    overflowX,
    overflowY,
    width,
    height,
    style,
    ...props
  }, ref) => {
    return (
      <Component
        ref={ref}
        style={{
          ...(width && { width }),
          ...(height && { height }),
          ...style,
        }}
        className={cn(
          // Padding
          responsiveClasses(p, paddingClasses),
          responsiveClasses(px, pxClasses),
          responsiveClasses(py, pyClasses),
          responsiveClasses(pt, ptClasses),
          responsiveClasses(pr, prClasses),
          responsiveClasses(pb, pbClasses),
          responsiveClasses(pl, plClasses),
          // Margin
          responsiveClasses(m, marginClasses),
          responsiveClasses(mx, mxClasses),
          responsiveClasses(my, myClasses),
          responsiveClasses(mt, mtClasses),
          responsiveClasses(mr, mrClasses),
          responsiveClasses(mb, mbClasses),
          responsiveClasses(ml, mlClasses),
          // Layout
          responsiveClasses(display, displayClasses),
          position && positionClasses[position],
          inset && 'inset-0',
          overflow && overflowClasses[overflow],
          overflowX && overflowXClasses[overflowX],
          overflowY && overflowYClasses[overflowY],
          className
        )}
        {...props}
      />
    )
  }
)

Box.displayName = 'Box'