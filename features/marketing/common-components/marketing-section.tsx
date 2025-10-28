import { type ComponentProps, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

const spacingMap = {
  none: '',
  compact: 'py-10 md:py-12 lg:py-14',
  normal: 'py-16 md:py-20 lg:py-24',
  relaxed: 'py-20 md:py-24 lg:py-28',
} as const

type MarketingSectionProps = ComponentProps<'section'> & {
  children: ReactNode
  spacing?: keyof typeof spacingMap
  containerClassName?: string
  groupClassName?: string
}

export function MarketingSection({
  children,
  spacing = 'normal',
  className,
  containerClassName,
  groupClassName,
  ...props
}: MarketingSectionProps) {
  return (
    <section
      className={cn('w-full', spacingMap[spacing], className)}
      {...props}
    >
      <div
        className={cn(
          'mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8',
          containerClassName,
        )}
      >
        <div className={cn('flex flex-col gap-8', groupClassName)}>{children}</div>
      </div>
    </section>
  )
}
