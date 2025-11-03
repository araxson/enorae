import { getServiceCategories } from './api/queries'
import { ServiceCategoriesClient } from './components'

export async function ServiceCategories() {
  const categories = await getServiceCategories()
  return <ServiceCategoriesClient initialCategories={categories} />
}
export * from './api/types'
