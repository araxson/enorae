import { Badge } from '@/components/ui/badge'
import { Check, Shield, Star, Users } from 'lucide-react'

export type TrustBadgeType = 'verified' | 'secure' | 'rated' | 'popular'

interface TrustBadgeProps {
  type: TrustBadgeType
  text?: string
  variant?: 'default' | 'outline' | 'secondary'
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
    defaultText: '4.8 average rating',
  },
  popular: {
    icon: Users,
    defaultText: '10,000+ users',
  },
}

export function TrustBadge({ type, text, variant = 'outline' }: TrustBadgeProps) {
  const config = badgeConfig[type]
  const Icon = config.icon
  const displayText = text || config.defaultText

  return (
    <Badge variant={variant} aria-label={displayText}>
      <Icon className="mr-1 size-3" aria-hidden="true" />
      {displayText}
    </Badge>
  )
}
