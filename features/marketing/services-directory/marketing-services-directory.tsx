import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Stack, Section, Box } from '@/components/layout'
import { H1, H2, P } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'
import { generateMetadata as genMeta } from '@/lib/metadata'
import { CategoryNavigation, PopularServicesWidget } from './components/category-navigation'
import { ServicesGrid } from './components/services-grid'
import { CategorySalons } from './components/category-salons'
import {
  getPublicServices,
  getPublicServiceCategories,
  getPublicCategoryBySlug,
  getSalonsOfferingCategory,
  getPopularServices,
} from './api/queries'

export async function ServicesDirectory() {
  const [services, categories, popularServices] = await Promise.all([
    getPublicServices(),
    getPublicServiceCategories(),
    getPopularServices(10),
  ])

  return (
    <Section size="lg">
      <Stack gap="xl">
        <Box>
          <Stack gap="md">
            <H1>Browse Services</H1>
            <P className="text-muted-foreground">
              Explore all available beauty and wellness services. Find the perfect treatment for your needs.
            </P>
          </Stack>
        </Box>

        <CategoryNavigation categories={categories} />

        {popularServices.length > 0 && (
          <>
            <PopularServicesWidget services={popularServices} />
            <Separator />
          </>
        )}

        <Stack gap="md">
          <H2>All Services</H2>
          <ServicesGrid services={services} />
        </Stack>
      </Stack>
    </Section>
  )
}

interface CategoryDetailProps {
  categorySlug: string
}

export async function CategoryDetail({ categorySlug }: CategoryDetailProps) {
  const [category, services, categories, salons] = await Promise.all([
    getPublicCategoryBySlug(categorySlug),
    getPublicServices(categorySlug),
    getPublicServiceCategories(),
    getSalonsOfferingCategory(categorySlug),
  ])

  if (!category) {
    notFound()
  }

  return (
    <Section size="lg">
      <Stack gap="xl">
        <Box>
          <Stack gap="md">
            <H1>{category.name}</H1>
            <P className="text-muted-foreground">
              Browse {category.count} {category.name.toLowerCase()} services offered by {salons.length} salon{salons.length !== 1 ? 's' : ''}.
            </P>
          </Stack>
        </Box>

        <CategoryNavigation categories={categories} currentCategory={categorySlug} />

        <Stack gap="md">
          <H2>{category.name} Services</H2>
          <ServicesGrid services={services} categoryName={category.name} />
        </Stack>

        <Separator />

        <Stack gap="md">
          <H2>Salons Offering {category.name}</H2>
          <CategorySalons salons={salons} categoryName={category.name} />
        </Stack>
      </Stack>
    </Section>
  )
}

export async function MarketingServicesDirectoryPage() {
  return <ServicesDirectory />
}

interface MarketingServicesCategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export async function MarketingServicesCategoryPage({
  params,
}: MarketingServicesCategoryPageProps) {
  const { category } = await params
  return <CategoryDetail categorySlug={category} />
}

export async function generateServicesCategoryMetadata({
  params,
}: MarketingServicesCategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const categoryData = await getPublicCategoryBySlug(category)

  if (!categoryData) {
    return genMeta({
      title: 'Category Not Found',
      description: 'The service category you are looking for could not be found.',
    })
  }

  return genMeta({
    title: `${categoryData.name} Services`,
    description: `Browse ${categoryData.count} ${categoryData.name.toLowerCase()} services. Find salons offering ${categoryData.name.toLowerCase()} near you.`,
    keywords: [
      categoryData.name,
      'services',
      'salon services',
      'beauty services',
      'wellness',
      'book appointment',
    ],
  })
}
