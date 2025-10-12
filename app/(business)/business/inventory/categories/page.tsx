import { ProductCategories } from '@/features/business/inventory-categories'

export const metadata = {
  title: 'Product Categories',
  description: 'Manage product categories for inventory organization',
}

export default async function ProductCategoriesPage() {
  return <ProductCategories />
}
