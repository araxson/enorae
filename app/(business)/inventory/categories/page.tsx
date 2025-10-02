import { ProductCategories } from '@/features/product-categories'
import { getProductCategories } from '@/features/product-categories/dal/product-categories.queries'

export const metadata = {
  title: 'Product Categories',
  description: 'Manage product categories for inventory organization',
}

export default async function ProductCategoriesPage() {
  const categories = await getProductCategories()
  return <ProductCategories initialCategories={categories} />
}
