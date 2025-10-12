import { getServiceCategories } from './api/queries'
import { ServiceCategoriesClient } from './components/service-categories-client'

export async function ServiceCategories() {
  const categories = await getServiceCategories()
  return <ServiceCategoriesClient initialCategories={categories} />
}
