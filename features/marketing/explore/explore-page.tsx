import { Item, ItemContent, ItemDescription, ItemGroup } from '@/components/ui/item'
import { ExploreListing } from './sections'
import { getPublicSalons } from './api/queries'

export async function MarketingExplorePage() {
  const salons = await getPublicSalons()
  return (
    <ItemGroup className="gap-6">
      <Item className="items-center justify-center text-center" variant="muted">
        <ItemContent>
          <ItemDescription>Browse every verified salon on Enorae or filter inside the directory below.</ItemDescription>
        </ItemContent>
      </Item>
      <ExploreListing salons={salons} />
    </ItemGroup>
  )
}
