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

export default function SalonsLoading() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <ItemGroup className="gap-4">
        <Item className="flex-col items-start gap-3" variant="muted">
          <ItemContent className="flex items-center gap-2">
            <Spinner className="text-muted-foreground" />
            <ItemTitle>Loading salon directory</ItemTitle>
          </ItemContent>
          <ItemContent className="flex flex-col gap-2">
            <ItemDescription>Fetching salons that match your preferences.</ItemDescription>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </ItemContent>
        </Item>
      </ItemGroup>

      <ItemGroup>
        <Item className="w-full items-center gap-4" variant="muted">
          <ItemContent className="flex-1">
            <Skeleton className="h-10 w-full" />
          </ItemContent>
          <ItemContent className="w-32">
            <Skeleton className="h-10 w-full" />
          </ItemContent>
        </Item>
      </ItemGroup>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(9)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <ItemGroup>
                <Item className="flex-col items-start gap-2">
                  <ItemContent>
                    <ItemTitle>
                      <span className="sr-only">Loading salon preview</span>
                    </ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <Skeleton className="h-48 w-full rounded-md" />
                  </ItemContent>
                </Item>
              </ItemGroup>
            </CardHeader>
            <CardContent>
              <ItemGroup className="gap-3">
                <Item className="flex-col items-start gap-3">
                  <ItemContent>
                    <Skeleton className="h-6 w-3/4" />
                  </ItemContent>
                  <ItemContent>
                    <Skeleton className="h-4 w-full" />
                  </ItemContent>
                  <ItemContent>
                    <Skeleton className="h-4 w-2/3" />
                  </ItemContent>
                  <ItemContent className="mt-4 flex w-full items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </ItemContent>
                </Item>
              </ItemGroup>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
