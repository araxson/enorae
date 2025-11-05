import { Item, ItemContent, ItemGroup, ItemHeader } from '@/components/ui/item'
import { Skeleton } from '@/components/ui/skeleton'
import { MarketingSection } from '@/features/marketing/components/common'

function ListingSkeletonCard() {
  return (
    <Item variant="outline" className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <Skeleton className="h-10 w-full" />
    </Item>
  )
}

export default function ExploreLoading() {
  return (
    <main className="flex flex-col gap-10">
      <MarketingSection spacing="compact">
        <Item variant="muted">
          <ItemContent>
            <div className="flex flex-col items-center gap-3 text-center">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </ItemContent>
        </Item>
      </MarketingSection>

      <MarketingSection className="pb-16 pt-6" spacing="none" groupClassName="gap-8">
        <ItemGroup className="gap-4">
          <Item variant="muted">
            <ItemHeader>
              <Skeleton className="h-6 w-32" />
            </ItemHeader>
            <ItemContent>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-56" />
                <Skeleton className="h-4 w-72" />
              </div>
            </ItemContent>
          </Item>
        </ItemGroup>

        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-24" />
        </div>

        <Skeleton className="h-4 w-56" />

        <div className="flex flex-col gap-3 sm:flex-row">
          <Skeleton className="h-12 w-full sm:w-96" />
          <Skeleton className="h-12 w-full sm:w-40" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ListingSkeletonCard key={index} />
          ))}
        </div>
      </MarketingSection>
    </main>
  )
}
