import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { MarketingPanel, MarketingSection } from '@/features/marketing/components/common'

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
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Services</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <MarketingPanel
        variant="muted"
        description="Browse every service Enorae salons offer and jump into details quickly."
      />
      <DirectoryHeader />
      <CategoryNavigation categories={categories} />
      {popularServices.length > 0 ? (
        <>
          <PopularServicesWidget services={popularServices} />
          <Separator />
        </>
      ) : null}
      <div className="flex flex-col gap-4">
        <MarketingPanel
          variant="muted"
          title="All services"
          description="Compare durations, pricing, and highlights at a glance."
        />
        <ServicesGrid services={services} />
      </div>
    </MarketingSection>
  )
}
