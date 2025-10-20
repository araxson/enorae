import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star } from 'lucide-react'

interface TestimonialCardProps {
  author: string
  role: string
  content: string
  rating: number
  avatar?: string
}

export function TestimonialCard({
  author,
  role,
  content,
  rating,
  avatar,
}: TestimonialCardProps) {
  const initials = author
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="h-full">
      <Card>
        <CardContent className="flex h-full flex-col gap-4 pt-6">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`h-4 w-4 ${
                  index < rating ? 'fill-primary text-primary' : 'fill-muted text-muted'
                }`}
              />
            ))}
          </div>

          <p className="leading-7 flex-1 italic text-muted-foreground">&ldquo;{content}&rdquo;</p>

          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {avatar && <AvatarImage src={avatar} alt={author} />}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <small className="text-sm font-medium leading-none font-semibold">{author}</small>
              <p className="text-sm text-muted-foreground text-xs">{role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
