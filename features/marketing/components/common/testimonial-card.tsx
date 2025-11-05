import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            {avatar && <AvatarImage src={avatar} alt={author} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle>{author}</CardTitle>
            <CardDescription>{role}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Item variant="muted" aria-label={`Rating ${rating} out of 5`}>
          <ItemMedia variant="icon">
            <Star className="size-4" aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{rating.toFixed(1)} out of 5</ItemTitle>
            <div className="flex gap-0.5" aria-hidden="true">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={`size-3 ${index < filledStars ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`}
                  aria-hidden="true"
                />
              ))}
            </div>
            <ItemDescription>
              Verified customer satisfaction score based on recent appointments.
            </ItemDescription>
          </ItemContent>
        </Item>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground text-balance">
          &ldquo;{content}&rdquo;
        </p>
      </CardFooter>
    </Card>
  )
}
