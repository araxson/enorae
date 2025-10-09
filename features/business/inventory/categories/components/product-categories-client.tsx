'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Stack, Flex } from '@/components/layout'
import { CategoryList } from './category-list'
import { CategoryForm } from './category-form'
import type { ProductCategoryWithCounts } from '../api/queries'

type ProductCategoriesClientProps = {
  initialCategories: ProductCategoryWithCounts[]
}

export function ProductCategoriesClient({ initialCategories }: ProductCategoriesClientProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ProductCategoryWithCounts | null>(null)

  const handleEdit = (category: ProductCategoryWithCounts) => {
    setEditingCategory(category)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingCategory(null)
  }

  return (
    <Stack gap="xl">
      <Flex align="center" justify="end">
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </Flex>

      <CategoryList categories={initialCategories} onEdit={handleEdit} />

      <CategoryForm
        category={editingCategory}
        open={isFormOpen}
        onOpenChange={handleCloseForm}
      />
    </Stack>
  )
}
