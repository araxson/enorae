import { Star, Flag, MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { ModerationReview } from '@/features/admin/moderation/api/queries'
import type { ReactNode } from 'react'

export function InfoBlock({ label, value, helper }: { label: string; value: string; helper?: string | null }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
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
      <Star className="h-4 w-4 text-accent" fill="currentColor" />
      {review['rating']}
    </span>,
  ]

  if (review['is_flagged']) {
    badges.push(
      <div key="flagged" className="flex items-center gap-1">
        <Flag className="h-3 w-3" />
        <Badge variant="destructive">Flagged</Badge>
      </div>
    )
  }
  if (review['is_featured']) {
    badges.push(
      <div key="featured" className="flex items-center gap-1">
        <Star className="h-3 w-3" />
        <Badge variant="default">Featured</Badge>
      </div>
    )
  }
  if (review['has_response']) {
    badges.push(
      <div key="responded" className="flex items-center gap-1">
        <MessageSquare className="h-3 w-3" />
        <Badge variant="outline">Responded</Badge>
      </div>
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
  if (tone) {
    return (
      <Alert variant={tone === 'destructive' ? 'destructive' : 'default'}>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{children}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">{children}</CardContent>
    </Card>
  )
}
