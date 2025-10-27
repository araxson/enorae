import { Progress } from '@/components/ui/progress'
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup } from '@/components/ui/item'

interface ProgressSectionProps {
  progress: number
}

export function ProgressSection({ progress }: ProgressSectionProps) {
  return (
    <div className="space-y-2">
      <ItemGroup>
        <Item>
          <ItemContent>
            <ItemDescription>Progress</ItemDescription>
          </ItemContent>
          <ItemActions className="flex-none">
            <ItemDescription>{progress}%</ItemDescription>
          </ItemActions>
        </Item>
      </ItemGroup>
      <Progress value={progress} className="h-2" />
    </div>
  )
}
