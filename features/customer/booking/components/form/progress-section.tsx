import { Progress } from '@/components/ui/progress'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Sparkles } from 'lucide-react'

interface ProgressSectionProps {
  progress: number
}

export function ProgressSection({ progress }: ProgressSectionProps) {
  return (
    <div className="space-y-2">
      <ItemGroup>
        <Item>
          <ItemMedia variant="icon">
            <Sparkles className="size-4" aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Progress</ItemTitle>
          </ItemContent>
          <ItemActions className="flex-none">
            <ItemDescription>{progress}% complete</ItemDescription>
          </ItemActions>
        </Item>
      </ItemGroup>
      <Progress value={progress} className="h-2" />
    </div>
  )
}
