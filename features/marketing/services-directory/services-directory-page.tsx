import { Separator } from '@/components/ui/separator'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { MarketingSection } from '@/features/marketing/common-components'

import {
  CategoryNavigation,
  DirectoryHeader,
  PopularServicesWidget,
  ServicesGrid,
} from './sections'
import {
  getPopularServices,
  getPublicServiceCategories,
  getPublicServices,
} from './api/queries'

export async function ServicesDirectoryPage() {
  const [services, categories, popularServices] = await Promise.all([
    getPublicServices(),
    getPublicServiceCategories(),
    getPopularServices(10),
  ])

  return (
    <MarketingSection
      spacing="normal"
      containerClassName="max-w-6xl"
      groupClassName="gap-8"
    >
      <Item variant="muted">
        <ItemContent>
          <ItemDescription>Browse every service Enorae salons offer and jump into details quickly.</ItemDescription>
        </ItemContent>
      </Item>
      <DirectoryHeader />
      <CategoryNavigation categories={categories} />
      {popularServices.length > 0 ? (
        <>
          <PopularServicesWidget services={popularServices} />
          <Separator />
        </>
      ) : null}
      <div className="flex flex-col gap-4">
        <Item variant="muted">
          <ItemHeader>
            <ItemTitle>All Services</ItemTitle>
          </ItemHeader>
        </Item>
        <ServicesGrid services={services} />
      </div>
    </MarketingSection>
  )
}
