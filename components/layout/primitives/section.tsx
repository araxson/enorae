/**
 * Section Component
 *
 * Semantic sectioning element with consistent vertical spacing.
 * Can automatically wrap content in a Container.
 */

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Container, type ContainerProps } from './container'
import type { ResponsiveValue, Spacing } from '../types'
import { responsiveClasses } from '../utils/responsive'

const sectionPadding = {
  none: '',
  xs: 'py-4 md:py-6',
  sm: 'py-8 md:py-12',
  md: 'py-12 md:py-16 lg:py-20',
  lg: 'py-16 md:py-24 lg:py-32',
  xl: 'py-20 md:py-32 lg:py-40',
  '2xl': 'py-24 md:py-40 lg:py-48',
  '3xl': 'py-32 md:py-48 lg:py-56',
} satisfies Record<Spacing, string>

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType
  size?: ResponsiveValue<Spacing>
  container?: boolean
  containerSize?: ContainerProps['size']
  containerNoPadding?: boolean
  fullWidth?: boolean
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({
    as: Component = 'section',
    className,
    size = 'md',
    container = true,
    containerSize,
    containerNoPadding,
    fullWidth = false,
    children,
    ...props
  }, ref) => {
    const content = container && !fullWidth ? (
      <Container size={containerSize} noPadding={containerNoPadding}>
        {children}
      </Container>
    ) : children

    return (
      <Component
        ref={ref}
        className={cn(
          responsiveClasses(size, sectionPadding),
          className
        )}
        {...props}
      >
        {content}
      </Component>
    )
  }
)

Section.displayName = 'Section'