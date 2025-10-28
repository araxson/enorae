import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { generateMetadata as genMeta } from '@/lib/metadata'
import { MarketingSection } from '@/features/marketing/common-components'

import {
  CategoryNavigation,
  ServicesGrid,
  CategorySalons,
} from './sections'
import {
  getPublicCategoryBySlug,
  getPublicServiceCategories,
  getPublicServices,
  getSalonsOfferingCategory,
} from './api/queries'

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
    <MarketingSection
      spacing="normal"
      containerClassName="max-w-6xl"
      groupClassName="gap-8"
    >
      <div className="flex flex-col gap-4">
        <Item className="flex-col" variant="muted">
          <ItemHeader>
            <ItemTitle>{category.name}</ItemTitle>
          </ItemHeader>
          <ItemContent>
            <ItemDescription>
              Browse {category.count} {category.name.toLowerCase()} services
              offered by {salons.length} salon{salons.length === 1 ? '' : 's'}.
            </ItemDescription>
          </ItemContent>
        </Item>
      </div>

      <CategoryNavigation
        categories={categories}
        currentCategory={categorySlug}
      />

      <div className="flex flex-col gap-4">
        <Item className="flex-col" variant="muted">
          <ItemHeader>
            <ItemTitle>{category.name} Services</ItemTitle>
          </ItemHeader>
        </Item>
        <ServicesGrid services={services} categoryName={category.name} />
      </div>

      <Separator />

      <div className="flex flex-col gap-4">
        <Item className="flex-col" variant="muted">
          <ItemHeader>
            <ItemTitle>Salons Offering {category.name}</ItemTitle>
          </ItemHeader>
        </Item>
        <CategorySalons salons={salons} categoryName={category.name} />
      </div>
    </MarketingSection>
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
