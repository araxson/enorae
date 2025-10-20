import { Badge } from '@/components/ui/badge'
import { Check, Shield, Star, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TrustBadgeType = 'verified' | 'secure' | 'rated' | 'popular'

interface TrustBadgeProps {
  type: TrustBadgeType
  text?: string
  variant?: 'default' | 'outline' | 'secondary'
  className?: string
}

const badgeConfig = {
  verified: {
    icon: Check,
    defaultText: 'Verified salons',
    className: 'bg-success/10 text-success hover:bg-success/15',
  },
  secure: {
    icon: Shield,
    defaultText: 'Secure platform',
    className: 'bg-info/10 text-info hover:bg-info/15',
  },
  rated: {
    icon: Star,
    defaultText: '4.8★ rated',
    className: 'bg-warning/10 text-warning hover:bg-warning/15',
  },
  popular: {
    icon: Users,
    defaultText: '10,000+ users',
    className: 'bg-accent/10 text-accent-foreground hover:bg-accent/15',
  },
}

export function TrustBadge({ type, text, variant = 'default', className }: TrustBadgeProps) {
  const config = badgeConfig[type]
  const Icon = config.icon
  const displayText = text || config.defaultText

  return (
    <Badge
      variant={variant}
      className={cn('gap-1 px-3 py-1 text-xs font-medium', config.className, className)}
    >
      <Icon className="h-3 w-3" />
      <span>{displayText}</span>
    </Badge>
  )
}
