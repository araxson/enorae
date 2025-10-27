import { Item, ItemContent, ItemDescription, ItemGroup } from '@/components/ui/item'

import {
  DirectoryHeader,
  SalonFilters,
  SalonGrid,
} from './sections'
import {
  getPublicSalonCities,
  getPublicSalonServices,
  getPublicServiceCategories,
  getPublicSalons,
  getPublicSalonBySlug,
} from './api/queries'
import type { SalonSearchParams } from './api/queries'

interface SalonDirectoryPageProps {
  searchParams?:
    | SalonSearchParams
    | Promise<SalonSearchParams | undefined>
    | undefined
}

export async function SalonDirectoryPage({
  searchParams,
}: SalonDirectoryPageProps) {
  let resolvedSearchParams: SalonSearchParams | undefined

  if (searchParams && typeof (searchParams as Promise<SalonSearchParams>).then === 'function') {
    resolvedSearchParams = await (searchParams as Promise<SalonSearchParams | undefined>)
  } else {
    resolvedSearchParams = searchParams as SalonSearchParams | undefined
  }

  const [salons, cities, categories] = await Promise.all([
    getPublicSalons(resolvedSearchParams),
    getPublicSalonCities(),
    getPublicServiceCategories(),
  ])

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <ItemGroup className="gap-8">
        <Item className="flex-col" variant="muted">
          <ItemContent>
            <ItemDescription>Discover salons near you and tailor the list with filters and categories.</ItemDescription>
          </ItemContent>
        </Item>
        <DirectoryHeader />
        <SalonFilters cities={cities} categories={categories} />
        <SalonGrid salons={salons} />
      </ItemGroup>
    </section>
  )
}

export async function getSalonProfile(slug: string) {
  const salon = await getPublicSalonBySlug(slug)
  if (!salon) {
    return null
  }

  const services = await getPublicSalonServices(salon['id']!)
  return { salon, services }
}
