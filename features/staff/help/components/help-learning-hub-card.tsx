import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

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
        <CardTitle>Learning hub</CardTitle>
        <CardDescription>Follow tailored training tracks to sharpen your craft.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tracks.map((track, index) => (
            <Card key={track.title}>
              <CardContent>
                <div className="space-y-3 pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle>{track.title}</CardTitle>
                      <CardDescription>{track.duration} • {track.level}</CardDescription>
                    </div>
                    <Badge variant={index === 0 ? 'secondary' : 'outline'}>
                      {index === 0 ? 'Recommended' : 'Track'}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {track.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    Start lesson
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Separator />

          <p className="text-muted-foreground">
            New tracks are dropped every other Thursday. Follow a track to get notified when content refreshes.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
