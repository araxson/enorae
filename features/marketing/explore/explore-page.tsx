import { Item, ItemContent, ItemDescription } from '@/components/ui/item'
import { MarketingSection } from '@/features/marketing/common-components'
import { ExploreListing } from './sections'
import { getPublicSalons } from './api/queries'

export async function MarketingExplorePage() {
  const salons = await getPublicSalons()
  return (
    <main className="flex flex-col gap-10">
      <MarketingSection spacing="compact">
        <Item variant="muted">
          <ItemContent>
            <div className="flex flex-col items-center text-center">
              <ItemDescription>Browse every verified salon on Enorae or filter inside the directory below.</ItemDescription>
            </div>
          </ItemContent>
        </Item>
      </MarketingSection>
      <ExploreListing salons={salons} />
    </main>
  )
}
