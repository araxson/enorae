import { getProductCategories } from './api/queries'
import { ProductCategoriesClient } from './components/product-categories-client'

export async function ProductCategories() {
  const categories = await getProductCategories()
  return <ProductCategoriesClient initialCategories={categories} />
}
