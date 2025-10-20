import { Star, Flag, MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { ModerationReview } from '../api/queries'
import type { ReactNode } from 'react'

export function InfoBlock({ label, value, helper }: { label: string; value: string; helper?: string | null }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="leading-7 font-medium">{value}</p>
      {helper && <p className="text-xs text-muted-foreground">{helper}</p>}
    </div>
  )
}

export function DetailCard({ title, badge, description }: { title: string; badge: ReactNode; description?: string }) {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm">{badge}</div>
      </CardContent>
    </Card>
  )
}

export function StatusBadges({ review }: { review: ModerationReview }) {
  const badges: ReactNode[] = [
    <span key="rating" className="flex items-center gap-1 font-semibold">
      <Star className="h-4 w-4 text-warning" fill="currentColor" />
      {review.rating}
    </span>,
  ]

  if (review.is_flagged) {
    badges.push(
      <Badge key="flagged" variant="destructive" className="gap-1">
        <Flag className="h-3 w-3" />
        Flagged
      </Badge>
    )
  }
  if (review.is_featured) {
    badges.push(
      <Badge key="featured" variant="default" className="gap-1">
        <Star className="h-3 w-3" />
        Featured
      </Badge>
    )
  }
  if (review.has_response) {
    badges.push(
      <Badge key="responded" variant="outline" className="gap-1">
        <MessageSquare className="h-3 w-3" />
        Responded
      </Badge>
    )
  }

  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">Rating & status</p>
      <div className="flex flex-wrap items-center gap-2">{badges}</div>
    </div>
  )
}

export function Panel({ title, children, tone }: { title: string; children: ReactNode; tone?: 'destructive' | 'info' }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{title}</p>
      {tone ? (
        <Alert variant={tone === 'destructive' ? 'destructive' : 'default'}>
          <AlertDescription>{children}</AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardContent className="text-sm">{children}</CardContent>
        </Card>
      )}
    </div>
  )
}
