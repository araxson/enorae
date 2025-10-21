import { Metadata } from 'next'
import { notFound } from 'next/navigation'
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
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <div>
          <div className="flex flex-col gap-4">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Browse Services</h1>
            <p className="leading-7 text-muted-foreground">
              Explore all available beauty and wellness services. Find the perfect treatment for your needs.
            </p>
          </div>
        </div>

        <CategoryNavigation categories={categories} />

        {popularServices.length > 0 && (
          <>
            <PopularServicesWidget services={popularServices} />
            <Separator />
          </>
        )}

        <div className="flex flex-col gap-4">
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">All Services</h2>
          <ServicesGrid services={services} />
        </div>
      </div>
    </section>
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
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <div>
          <div className="flex flex-col gap-4">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">{category.name}</h1>
            <p className="leading-7 text-muted-foreground">
              Browse {category.count} {category.name.toLowerCase()} services offered by {salons.length} salon{salons.length !== 1 ? 's' : ''}.
            </p>
          </div>
        </div>

        <CategoryNavigation categories={categories} currentCategory={categorySlug} />

        <div className="flex flex-col gap-4">
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">{category.name} Services</h2>
          <ServicesGrid services={services} categoryName={category.name} />
        </div>

        <Separator />

        <div className="flex flex-col gap-4">
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">Salons Offering {category.name}</h2>
          <CategorySalons salons={salons} categoryName={category.name} />
        </div>
      </div>
    </section>
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
