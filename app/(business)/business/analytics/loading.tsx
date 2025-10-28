import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { Spinner } from '@/components/ui/spinner'

export default function AnalyticsLoading() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <ItemGroup className="gap-4">
        <Item className="flex-col items-start gap-3" variant="muted">
          <ItemContent className="flex items-center gap-2">
            <Spinner className="text-muted-foreground" />
            <ItemTitle>Loading business analytics</ItemTitle>
          </ItemContent>
          <ItemContent className="flex flex-col gap-2">
            <ItemDescription>Compiling salon performance insights.</ItemDescription>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </ItemContent>
        </Item>
      </ItemGroup>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <ItemGroup>
                <Item className="flex-col items-start gap-2">
                  <ItemContent>
                    <ItemTitle>
                      <span className="sr-only">Loading analytics summary</span>
                    </ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <Skeleton className="h-4 w-24" />
                  </ItemContent>
                </Item>
              </ItemGroup>
            </CardHeader>
            <CardContent>
              <ItemGroup>
                <Item className="flex-col items-start gap-2">
                  <ItemContent>
                    <Skeleton className="h-8 w-32" />
                  </ItemContent>
                </Item>
              </ItemGroup>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <ItemGroup>
            <Item className="flex-col items-start gap-3">
              <ItemContent>
                <ItemTitle>
                  <span className="sr-only">Loading analytics chart</span>
                </ItemTitle>
              </ItemContent>
              <ItemContent>
                <Skeleton className="h-6 w-48" />
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <ItemGroup>
            <Item className="flex-col items-start gap-2">
              <ItemContent>
                <Skeleton className="h-64 w-full" />
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardContent>
      </Card>
    </div>
  )
}
