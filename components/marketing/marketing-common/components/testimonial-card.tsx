import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
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
      <Card className="h-full">
        <CardHeader className="space-y-2">
          <CardTitle>Customer rating</CardTitle>
          <CardDescription>
            Feedback from recent salon guests.
          </CardDescription>
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
        </CardHeader>
        <CardContent className="flex-1 pt-0">
          <CardDescription>
            <em>&ldquo;{content}&rdquo;</em>
          </CardDescription>
        </CardContent>
        <CardFooter className="gap-3">
          <Avatar className="h-10 w-10">
            {avatar && <AvatarImage src={avatar} alt={author} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="text-sm font-semibold">{author}</div>
            <div className="text-xs text-muted-foreground">{role}</div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
