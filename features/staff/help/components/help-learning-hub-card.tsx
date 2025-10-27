import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

type LearningTrack = {
  title: string
  duration: string
  level: string
  tags: string[]
}

interface HelpLearningHubCardProps {
  tracks: readonly LearningTrack[]
}

export function HelpLearningHubCard({ tracks }: HelpLearningHubCardProps) {
  return (
    <Card id="learning-hub">
      <CardHeader>
        <ItemGroup>
          <Item variant="muted" size="sm">
            <ItemContent>
              <CardTitle>Learning hub</CardTitle>
              <CardDescription>Follow tailored training tracks to sharpen your craft.</CardDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ItemGroup className="space-y-3">
            {tracks.map((track, index) => (
              <Item key={track.title} variant="outline" size="sm">
                <ItemContent>
                  <ItemTitle>{track.title}</ItemTitle>
                  <ItemDescription>{track.duration} • {track.level}</ItemDescription>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {track.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="pt-3">
                    <Button size="sm" variant="outline">
                      Start lesson
                    </Button>
                  </div>
                </ItemContent>
                <ItemActions>
                  <Badge variant={index === 0 ? 'secondary' : 'outline'}>
                    {index === 0 ? 'Recommended' : 'Track'}
                  </Badge>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>

          <Separator />

          <p className="text-muted-foreground">
            New tracks are dropped every other Thursday. Follow a track to get notified when content refreshes.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
