import { Item, ItemContent, ItemDescription } from '@/components/ui/item'
import { MarketingSection } from '@/features/marketing/components/common'

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

// Type guard for Promise check
function isPromise<T>(value: unknown): value is Promise<T> {
  if (!value || typeof value !== 'object') return false
  if (!('then' in value)) return false

  const maybePromise = value as Record<string, unknown>
  return typeof maybePromise['then'] === 'function'
}

export async function SalonDirectoryPage({
  searchParams,
}: SalonDirectoryPageProps) {
  let resolvedSearchParams: SalonSearchParams | undefined

  if (isPromise<SalonSearchParams | undefined>(searchParams)) {
    resolvedSearchParams = await searchParams
  } else {
    resolvedSearchParams = searchParams
  }

  const [salons, cities, categories] = await Promise.all([
    getPublicSalons(resolvedSearchParams),
    getPublicSalonCities(),
    getPublicServiceCategories(),
  ])

  return (
    <MarketingSection
      spacing="normal"
      containerClassName="max-w-6xl"
      groupClassName="gap-8"
    >
      <Item variant="muted">
        <ItemContent>
          <ItemDescription>Discover salons near you and tailor the list with filters and categories.</ItemDescription>
        </ItemContent>
      </Item>
      <DirectoryHeader />
      <SalonFilters cities={cities} categories={categories} />
      <SalonGrid salons={salons} />
    </MarketingSection>
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
