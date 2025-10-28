import { type LucideIcon } from 'lucide-react'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@/components/ui/empty'

export interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
  variant?: 'default' | 'icon'
}

/**
 * EmptyState Component
 *
 * Used for displaying empty states with optional actions.
 * Follows shadcn UI patterns for consistency.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={Package}
 *   title="No products yet"
 *   description="Get started by adding your first product"
 *   action={<Button onClick={handleAdd}>Add Product</Button>}
 * />
 * ```
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = 'icon',
}: EmptyStateProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant={variant}>
          <Icon className="size-8" aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {action && (
        <EmptyContent>
          {action}
        </EmptyContent>
      )}
    </Empty>
  )
}
