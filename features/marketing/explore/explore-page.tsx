import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { MarketingPanel, MarketingSection } from '@/features/marketing/components/common'
import { ExploreListing } from './sections'
import { getPublicSalons } from './api/queries'

export async function MarketingExplorePage() {
  const salons = await getPublicSalons()
  return (
    <main className="flex flex-col gap-10">
      <MarketingSection spacing="compact">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Explore salons</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <MarketingPanel
          variant="muted"
          align="center"
          description="Browse every verified salon on Enorae or filter inside the directory below."
        />
      </MarketingSection>
      <ExploreListing salons={salons} />
    </main>
  )
}
