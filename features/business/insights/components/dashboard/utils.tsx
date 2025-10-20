import {
  Users,
  Crown,
  Heart,
  AlertTriangle,
  UserPlus,
  UserX,
} from 'lucide-react'

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export const formatPercentage = (value: number) => {
  return `${value.toFixed(1)}%`
}

export const getSegmentIcon = (segment: string) => {
  switch (segment) {
    case 'VIP':
      return <Crown className="h-4 w-4 text-warning" />
    case 'Loyal':
      return <Heart className="h-4 w-4 text-destructive" />
    case 'Regular':
      return <Users className="h-4 w-4 text-info" />
    case 'At Risk':
      return <AlertTriangle className="h-4 w-4 text-warning" />
    case 'New':
      return <UserPlus className="h-4 w-4 text-success" />
    case 'Churned':
      return <UserX className="h-4 w-4 text-muted-foreground" />
    default:
      return <Users className="h-4 w-4" />
  }
}

export const getSegmentColor = (segment: string) => {
  switch (segment) {
    case 'VIP':
      return 'bg-warning/10 text-warning-foreground border-warning/50'
    case 'Loyal':
      return 'bg-destructive/20 text-destructive border-destructive'
    case 'Regular':
      return 'bg-info/20 text-info border-info'
    case 'At Risk':
      return 'bg-warning/10 text-warning-foreground border-warning/50'
    case 'New':
      return 'bg-success/20 text-success border-success'
    case 'Churned':
      return 'bg-muted text-muted-foreground border-border'
    default:
      return 'bg-muted text-muted-foreground'
  }
}
