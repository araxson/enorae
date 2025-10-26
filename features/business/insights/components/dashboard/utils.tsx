import {
  Users,
  Crown,
  Heart,
  AlertTriangle,
  UserPlus,
  UserX,
} from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/lib/utils/formatting'

// Re-export for backward compatibility
export { formatCurrency, formatPercentage }

export const getSegmentIcon = (segment: string) => {
  switch (segment) {
    case 'VIP':
      return <Crown className="h-4 w-4 text-accent" />
    case 'Loyal':
      return <Heart className="h-4 w-4 text-destructive" />
    case 'Regular':
      return <Users className="h-4 w-4 text-secondary" />
    case 'At Risk':
      return <AlertTriangle className="h-4 w-4 text-destructive" />
    case 'New':
      return <UserPlus className="h-4 w-4 text-primary" />
    case 'Churned':
      return <UserX className="h-4 w-4 text-muted-foreground" />
    default:
      return <Users className="h-4 w-4" />
  }
}

export const getSegmentColor = (segment: string) => {
  switch (segment) {
    case 'VIP':
      return 'bg-accent/10 text-accent border-accent/50'
    case 'Loyal':
      return 'bg-destructive/20 text-destructive border-destructive'
    case 'Regular':
      return 'bg-secondary/20 text-secondary border-secondary'
    case 'At Risk':
      return 'bg-destructive/10 text-destructive border-destructive/50'
    case 'New':
      return 'bg-primary/20 text-primary border-primary'
    case 'Churned':
      return 'bg-muted text-muted-foreground border-border'
    default:
      return 'bg-muted text-muted-foreground'
  }
}
