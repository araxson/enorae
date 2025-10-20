import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Stack, Section, Box } from '@/components/layout'
import { generateMetadata as genMeta } from '@/lib/metadata'
import { SalonFilters } from './components/salon-filters'
import { SalonGrid } from './components/salon-grid'
import { SalonProfileView } from './components/salon-profile-view'
import {
  getPublicSalons,
  getPublicSalonCities,
  getPublicServiceCategories,
  getPublicSalonBySlug,
  getPublicSalonServices,
} from './api/queries'
import type { SalonSearchParams } from './api/queries'

interface SalonDirectoryProps {
  searchParams?: SalonSearchParams
}

export async function SalonDirectory({ searchParams }: SalonDirectoryProps) {
  // Fetch data in parallel
  const [salons, cities, categories] = await Promise.all([
    getPublicSalons(searchParams),
    getPublicSalonCities(),
    getPublicServiceCategories(),
  ])

  return (
    <Section size="lg">
      <Stack gap="xl">
        {/* Header */}
        <Box>
          <Stack gap="md">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Discover Salons</h1>
            <p className="leading-7 text-muted-foreground">
              Find and book appointments at the best salons in your area
            </p>
          </Stack>
        </Box>

        {/* Filters */}
        <SalonFilters cities={cities} categories={categories} />

        {/* Results */}
        <SalonGrid salons={salons} />
      </Stack>
    </Section>
  )
}

export const marketingSalonDirectoryMetadata = genMeta({
  title: 'Discover Salons',
  description:
    'Browse and discover the best salons in your area. Find services, read reviews, and book appointments.',
  keywords: ['salons', 'beauty salons', 'hair salon', 'nail salon', 'spa', 'salon directory'],
})

interface MarketingSalonDirectoryPageProps {
  searchParams: Promise<{
    search?: string
    city?: string
    state?: string
    category?: string
  }>
}

export async function MarketingSalonDirectoryPage({ searchParams }: MarketingSalonDirectoryPageProps) {
  const params = await searchParams

  return (
    <SalonDirectory
      searchParams={{
        searchTerm: params.search,
        city: params.city,
        state: params.state,
      }}
    />
  )
}

interface SalonProfilePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateSalonProfileMetadata({ params }: SalonProfilePageProps): Promise<Metadata> {
  const { slug } = await params
  const salon = await getPublicSalonBySlug(slug)

  if (!salon) {
    return genMeta({
      title: 'Salon Not Found',
      description: 'The salon you are looking for could not be found.',
    })
  }

  return genMeta({
    title: salon.name || 'Salon Profile',
    description:
      salon.short_description ||
      salon.description ||
      `View ${salon.name} profile, services, and book appointments.`,
    keywords: [
      salon.name || '',
      salon.city || '',
      salon.state_province || '',
      'salon',
      'book appointment',
      ...(salon.specialties || []),
    ].filter(Boolean),
  })
}

export async function MarketingSalonProfilePage({ params }: SalonProfilePageProps) {
  const { slug } = await params

  const salon = await getPublicSalonBySlug(slug)
  if (!salon) {
    notFound()
  }

  const services = await getPublicSalonServices(salon.id!)

  return <SalonProfileView salon={salon} services={services} />
}
export { SalonProfileView }
