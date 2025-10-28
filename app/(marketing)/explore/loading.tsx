import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

export default function ExploreLoading() {
  return (
    <div className="container mx-auto py-12 space-y-8">
      <ItemGroup className="gap-6">
        <Item className="flex-col items-center gap-4" variant="muted">
          <ItemContent className="flex flex-col items-center gap-4 text-center">
            <Spinner className="size-6 text-muted-foreground" />
            <ItemTitle>Loading featured salons</ItemTitle>
            <ItemDescription>Tailoring recommendations for your next visit.</ItemDescription>
            <Skeleton className="h-12 w-96" />
            <Skeleton className="h-6 w-[32rem]" />
          </ItemContent>
        </Item>
      </ItemGroup>

      <ItemGroup>
        <Item className="flex-col items-center gap-4" variant="muted">
          <ItemContent className="w-full max-w-2xl">
            <Skeleton className="h-12 w-full rounded-lg" />
          </ItemContent>
        </Item>
      </ItemGroup>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(12)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader>
              <div className="p-0">
                <ItemGroup>
                  <Item className="flex-col items-start gap-2">
                    <ItemContent>
                      <ItemTitle>
                        <span className="sr-only">Loading salon listing</span>
                      </ItemTitle>
                    </ItemContent>
                    <ItemContent>
                      <Skeleton className="h-56 w-full" />
                    </ItemContent>
                  </Item>
                </ItemGroup>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ItemGroup className="gap-3">
                <Item className="flex-col items-start gap-3">
                  <ItemContent>
                    <Skeleton className="h-6 w-3/4" />
                  </ItemContent>
                  <ItemContent>
                    <Skeleton className="h-4 w-full" />
                  </ItemContent>
                  <ItemContent>
                    <Skeleton className="h-4 w-5/6" />
                  </ItemContent>
                  <ItemContent className="flex w-full items-center gap-4 pt-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </ItemContent>
                  <ItemContent className="mt-4 w-full">
                    <Skeleton className="h-10 w-full" />
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
