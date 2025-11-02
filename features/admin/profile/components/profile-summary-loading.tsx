import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Item,
  ItemContent,
  ItemGroup,
} from '@/components/ui/item'

export function ProfileSummaryLoading() {
  return (
    <Card>
      <CardHeader>
        <div className="pb-4">
          <ItemGroup>
            <Item variant="muted">
              <ItemContent>
                <CardTitle>Profile overview</CardTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </CardContent>
    </Card>
  )
}
