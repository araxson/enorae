import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
} from '@/components/ui/item'
import { generateMetadata as genMeta } from '@/lib/metadata'

import {
  CategoryNavigation,
  DirectoryHeader,
  PopularServicesWidget,
  ServicesGrid,
  CategorySalons,
} from './sections'
import {
  getPopularServices,
  getPublicCategoryBySlug,
  getPublicServiceCategories,
  getPublicServices,
  getSalonsOfferingCategory,
} from './api/queries'

export async function ServicesDirectoryPage() {
  const [services, categories, popularServices] = await Promise.all([
    getPublicServices(),
    getPublicServiceCategories(),
    getPopularServices(10),
  ])

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <ItemGroup className="gap-8">
        <Item className="flex-col" variant="muted">
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
        <ItemGroup className="gap-4">
          <Item className="flex-col" variant="muted">
            <ItemHeader>
              <h2 className="scroll-m-20">All Services</h2>
            </ItemHeader>
          </Item>
          <ServicesGrid services={services} />
        </ItemGroup>
      </ItemGroup>
    </section>
  )
}

interface ServicesCategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export async function ServicesCategoryPage({
  params,
}: ServicesCategoryPageProps) {
  const { category: categorySlug } = await params

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
      <ItemGroup className="gap-8">
        <ItemGroup className="gap-4">
          <Item className="flex-col" variant="muted">
            <ItemHeader>
              <h1 className="scroll-m-20">{category.name}</h1>
            </ItemHeader>
            <ItemContent>
              <ItemDescription>
                Browse {category.count} {category.name.toLowerCase()} services
                offered by {salons.length} salon{salons.length === 1 ? '' : 's'}.
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>

        <CategoryNavigation
          categories={categories}
          currentCategory={categorySlug}
        />

        <ItemGroup className="gap-4">
          <Item className="flex-col" variant="muted">
            <ItemHeader>
              <h2 className="scroll-m-20">{category.name} Services</h2>
            </ItemHeader>
          </Item>
          <ServicesGrid services={services} categoryName={category.name} />
        </ItemGroup>

        <Separator />

        <ItemGroup className="gap-4">
          <Item className="flex-col" variant="muted">
            <ItemHeader>
              <h2 className="scroll-m-20">Salons Offering {category.name}</h2>
            </ItemHeader>
          </Item>
          <CategorySalons salons={salons} categoryName={category.name} />
        </ItemGroup>
      </ItemGroup>
    </section>
  )
}

export async function generateServicesCategoryMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const categoryData = await getPublicCategoryBySlug(category)

  if (!categoryData) {
    return genMeta({
      title: 'Category Not Found',
      description:
        'The service category you are looking for could not be found.',
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
