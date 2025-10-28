import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'
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
    <Item variant="outline">
      <div className="flex h-full flex-col gap-4">
        <Item variant="muted">
          <ItemMedia>
            <Avatar className="size-10">
              {avatar && <AvatarImage src={avatar} alt={author} />}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{author}</ItemTitle>
            <ItemDescription>{role}</ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="muted" aria-label={`Rating ${rating} out of 5`}>
          <ItemMedia variant="icon">
            <Star className="size-4" aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{rating} out of 5</ItemTitle>
            <ItemDescription aria-hidden="true">{starVisualization}</ItemDescription>
            <ItemDescription>
              Verified customer satisfaction score based on recent appointments.
            </ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline">
          <ItemContent>
            <ItemDescription>&ldquo;{content}&rdquo;</ItemDescription>
          </ItemContent>
        </Item>
      </div>
    </Item>
  )
}
