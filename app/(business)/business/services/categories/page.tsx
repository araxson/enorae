import { ServiceCategories } from '@/features/business/service-categories'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Service Categories',
  description: 'Organize and manage categories for services',
  noIndex: true,
})

export default async function ServiceCategoriesPage() {
  return <ServiceCategories />
}
