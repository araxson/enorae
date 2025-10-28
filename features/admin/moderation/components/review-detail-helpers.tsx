import { Star, Flag, MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { ModerationReview } from '@/features/admin/moderation/api/queries'
import type { ReactNode } from 'react'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

export function InfoBlock({ label, value, helper }: { label: string; value: string; helper?: string | null }) {
  return (
    <ItemGroup>
      <Item className="flex-col items-start gap-1">
        <ItemContent>
          <ItemDescription>{label}</ItemDescription>
        </ItemContent>
        <ItemContent>
          <span className="font-medium">{value}</span>
        </ItemContent>
        {helper ? (
          <ItemContent>
            <ItemDescription>{helper}</ItemDescription>
          </ItemContent>
        ) : null}
      </Item>
    </ItemGroup>
  )
}

export function DetailCard({ title, badge, description }: { title: string; badge: ReactNode; description?: string }) {
  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item className="flex-col items-start gap-1">
            <ItemContent>
              <ItemTitle>{title}</ItemTitle>
            </ItemContent>
            {description ? (
              <ItemContent>
                <ItemDescription>{description}</ItemDescription>
              </ItemContent>
            ) : null}
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          <Item className="items-center gap-2 text-sm">
            <ItemActions className="flex items-center gap-2 text-sm">{badge}</ItemActions>
          </Item>
        </ItemGroup>
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
    <ItemGroup>
      <Item className="flex-col items-start gap-2">
        <ItemContent>
          <ItemDescription>Rating &amp; status</ItemDescription>
        </ItemContent>
        <ItemActions className="flex flex-wrap items-center gap-2">{badges}</ItemActions>
      </Item>
    </ItemGroup>
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
        <ItemGroup>
          <Item>
            <ItemContent>
              <ItemTitle>{title}</ItemTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          <Item className="flex-col items-start gap-2">
            <ItemContent>
              <span className="text-sm">{children}</span>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
