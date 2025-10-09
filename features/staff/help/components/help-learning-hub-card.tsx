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
      <CardContent className="space-y-4">
        {tracks.map((track, index) => (
          <div key={track.title} className="space-y-3 rounded-lg border p-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold">{track.title}</h3>
                <p className="text-xs text-muted-foreground">{track.duration} • {track.level}</p>
              </div>
              <Badge variant={index === 0 ? 'secondary' : 'outline'}>
                {index === 0 ? 'Recommended' : 'Track'}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
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
        ))}

        <Separator />

        <p className="text-xs text-muted-foreground">
          New tracks are dropped every other Thursday. Follow a track to get notified when content refreshes.
        </p>
      </CardContent>
    </Card>
  )
}

