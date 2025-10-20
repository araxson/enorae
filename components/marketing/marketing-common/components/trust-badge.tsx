import type { ComponentProps } from 'react'
import { Badge } from '@/components/ui/badge'
import { Check, Shield, Star, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TrustBadgeType = 'verified' | 'secure' | 'rated' | 'popular'

type BadgeVariant = ComponentProps<typeof Badge>['variant']

interface TrustBadgeProps {
  type: TrustBadgeType
  text?: string
  variant?: BadgeVariant
  className?: string
}

const badgeConfig = {
  verified: {
    icon: Check,
    defaultText: 'Verified salons',
    variant: 'default' as const,
  },
  secure: {
    icon: Shield,
    defaultText: 'Secure platform',
    variant: 'outline' as const,
  },
  rated: {
    icon: Star,
    defaultText: '4.8★ rated',
    variant: 'secondary' as const,
  },
  popular: {
    icon: Users,
    defaultText: '10,000+ users',
    variant: 'secondary' as const,
  },
}

export function TrustBadge({ type, text, variant, className }: TrustBadgeProps) {
  const config = badgeConfig[type]
  const Icon = config.icon
  const displayText = text || config.defaultText

  return (
    <Badge
      variant={variant ?? config.variant}
      className={cn('gap-1 px-3 py-1 text-xs font-medium', className)}
    >
      <Icon className="h-3 w-3" />
      <span className="text-xs font-medium leading-none text-inherit">{displayText}</span>
    </Badge>
  )
}
