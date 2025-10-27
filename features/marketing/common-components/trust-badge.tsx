import { Badge } from '@/components/ui/badge'
import { Check, Shield, Star, Users } from 'lucide-react'

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
  },
  secure: {
    icon: Shield,
    defaultText: 'Secure platform',
  },
  rated: {
    icon: Star,
    defaultText: '4.8★ rated',
  },
  popular: {
    icon: Users,
    defaultText: '10,000+ users',
  },
}

export function TrustBadge({ type, text, variant = 'outline', className }: TrustBadgeProps) {
  const config = badgeConfig[type]
  const Icon = config.icon
  const displayText = text || config.defaultText

  return (
    <Badge variant={variant} className={className} aria-label={displayText}>
      <Icon className="mr-1 h-3 w-3" aria-hidden="true" />
      <span className="font-medium">{displayText}</span>
    </Badge>
  )
}
