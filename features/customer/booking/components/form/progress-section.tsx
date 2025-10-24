import { Progress } from '@/components/ui/progress'

interface ProgressSectionProps {
  progress: number
}

export function ProgressSection({ progress }: ProgressSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="text-muted-foreground">Progress</div>
        <div className="text-muted-foreground">{progress}%</div>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}
