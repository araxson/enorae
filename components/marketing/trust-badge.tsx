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
    className: 'bg-green-500/10 text-green-600 hover:bg-green-500/15',
  },
  secure: {
    icon: Shield,
    defaultText: 'Secure platform',
    className: 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/15',
  },
  rated: {
    icon: Star,
    defaultText: '4.8★ rated',
    className: 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/15',
  },
  popular: {
    icon: Users,
    defaultText: '10,000+ users',
    className: 'bg-purple-500/10 text-purple-600 hover:bg-purple-500/15',
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
