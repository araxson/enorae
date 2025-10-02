import { ServiceCategories } from '@/features/service-categories'
import { getServiceCategories } from '@/features/service-categories/dal/service-categories.queries'

export const metadata = {
  title: 'Service Categories',
  description: 'Manage service categories for organization',
}

export default async function ServiceCategoriesPage() {
  const categories = await getServiceCategories()
  return <ServiceCategories initialCategories={categories} />
}
