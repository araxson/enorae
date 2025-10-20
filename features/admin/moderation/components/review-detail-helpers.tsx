import { Star, Flag, MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { ModerationReview } from '../api/queries'
import type { ReactNode } from 'react'

export function InfoBlock({ label, value, helper }: { label: string; value: string; helper?: string | null }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground text-sm">{label}</p>
      <p className="leading-7 font-medium">{value}</p>
      {helper && <p className="text-sm text-muted-foreground text-xs">{helper}</p>}
    </div>
  )
}

export function DetailCard({ title, badge, description }: { title: string; badge: ReactNode; description?: string }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="leading-7 text-sm font-medium">{title}</p>
      <div className="mt-2 flex items-center gap-2 text-sm">{badge}</div>
      {description && <p className="text-sm text-muted-foreground mt-1 block text-xs text-muted-foreground">{description}</p>}
    </div>
  )
}

export function StatusBadges({ review }: { review: ModerationReview }) {
  const badges: ReactNode[] = [
    <span key="rating" className="flex items-center gap-1 font-semibold">
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
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
      <p className="text-sm text-muted-foreground text-sm">Rating & status</p>
      <div className="flex flex-wrap items-center gap-2">{badges}</div>
    </div>
  )
}

export function Panel({ title, children, tone }: { title: string; children: ReactNode; tone?: 'destructive' | 'info' }) {
  const toneClasses =
    tone === 'destructive'
      ? 'border-red-200 bg-red-50 text-red-900'
      : tone === 'info'
      ? 'border-blue-200 bg-blue-50 text-blue-900'
      : 'bg-muted'

  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground text-sm">{title}</p>
      <div className={`rounded-md border p-3 text-sm ${toneClasses}`}>{children}</div>
    </div>
  )
}
