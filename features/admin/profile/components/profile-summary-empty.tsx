import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemGroup,
} from '@/components/ui/item'

export function ProfileSummaryEmpty() {
  return (
    <Card>
      <CardHeader>
        <div className="pb-2">
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
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No profile selected</EmptyTitle>
            <EmptyDescription>Pick a user to view account details and attributes.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </CardContent>
    </Card>
  )
}
