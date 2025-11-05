import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type SectionWidth = 'md' | 'lg' | 'xl'
type SectionPadding = 'none' | 'compact' | 'default'

const widthClasses: Record<SectionWidth, string> = {
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
}

const paddingClasses: Record<SectionPadding, string> = {
  none: '',
  compact: 'px-4 py-6 sm:px-6 lg:px-8',
  default: 'px-4 py-8 sm:px-6 lg:px-8 lg:py-12',
}

interface SectionProps {
  children: ReactNode
  className?: string
  width?: SectionWidth
  padding?: SectionPadding
  id?: string
  as?: 'section' | 'div'
}

interface SectionHeaderProps {
  children: ReactNode
  className?: string
}

interface SectionBodyProps {
  children: ReactNode
  className?: string
}

interface SectionFooterProps {
  children: ReactNode
  className?: string
}

export function Section({
  children,
  className,
  width = 'lg',
  padding = 'default',
  id,
  as = 'section',
}: SectionProps) {
  const Component = as

  return (
    <Component id={id} className={cn('w-full', className)}>
      <div className={cn('mx-auto w-full space-y-6', widthClasses[width], paddingClasses[padding])}>
        {children}
      </div>
    </Component>
  )
}

export function SectionHeader({ children, className }: SectionHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-2', className)}>
      {children}
    </header>
  )
}

export function SectionBody({ children, className }: SectionBodyProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {children}
    </div>
  )
}

export function SectionFooter({ children, className }: SectionFooterProps) {
  return (
    <footer className={cn('flex flex-col gap-4', className)}>
      {children}
    </footer>
  )
}
