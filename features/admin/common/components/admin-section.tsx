import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils/index'

type AdminSectionProps = {
  contentClassName?: string
} & HTMLAttributes<HTMLElement>

export function AdminSection({
  children,
  className,
  contentClassName,
  ...props
}: AdminSectionProps) {
  return (
    <section
      className={cn('py-16 md:py-24 lg:py-32', className)}
      {...props}
    >
      <div
        className={cn(
          'mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8',
          contentClassName,
        )}
      >
        {children}
      </div>
    </section>
  )
}
