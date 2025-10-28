import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Star } from 'lucide-react'

interface TestimonialCardProps {
  author: string
  role: string
  content: string
  rating: number
  avatar?: string
}

export function TestimonialCard({ author, role, content, rating, avatar }: TestimonialCardProps) {
  const initials = author
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  const filledStars = Math.round(Math.min(Math.max(rating, 0), 5))
  const starVisualization = `${'★'.repeat(filledStars)}${'☆'.repeat(5 - filledStars)}`

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center gap-3">
        <Avatar className="h-10 w-10">
          {avatar && <AvatarImage src={avatar} alt={author} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{author}</CardTitle>
          <CardDescription>{role}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-4 pt-2">
        <ItemGroup className="gap-3">
          <Item variant="muted" aria-label={`Rating ${rating} out of 5`}>
            <ItemHeader className="flex items-center gap-2">
              <ItemMedia variant="icon">
                <Star className="size-4" aria-hidden="true" />
              </ItemMedia>
              <ItemTitle>{rating} out of 5</ItemTitle>
            </ItemHeader>
            <ItemContent>
              <ItemDescription aria-hidden="true">{starVisualization}</ItemDescription>
              <ItemDescription>
                Verified customer satisfaction score based on recent appointments.
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
        <Item variant="outline">
          <ItemContent>
            <ItemDescription>&ldquo;{content}&rdquo;</ItemDescription>
          </ItemContent>
        </Item>
      </CardContent>
    </Card>
  )
}
