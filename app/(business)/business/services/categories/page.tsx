import { ServiceCategories } from '@/features/business/service-categories'

export const metadata = {
  title: 'Service Categories',
  description: 'Manage service categories for organization',
}

export default async function ServiceCategoriesPage() {
  return <ServiceCategories />
}
