'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 items-center justify-end">
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <CategoryList categories={initialCategories} onEdit={handleEdit} />

      <CategoryForm
        category={editingCategory}
        open={isFormOpen}
        onOpenChange={handleCloseForm}
      />
    </div>
  )
}
