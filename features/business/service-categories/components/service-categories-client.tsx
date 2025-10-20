'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoryList } from './category-list'
import { CategoryForm } from './category-form'
import type { ServiceCategoryWithCounts } from '../api/queries'

type ServiceCategoriesClientProps = {
  initialCategories: ServiceCategoryWithCounts[]
}

export function ServiceCategoriesClient({ initialCategories }: ServiceCategoriesClientProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ServiceCategoryWithCounts | null>(null)

  const handleEdit = (category: ServiceCategoryWithCounts) => {
    setEditingCategory(category)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingCategory(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">Service Categories</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Organize your services with categories
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <CategoryList categories={initialCategories} onEdit={handleEdit} />

      <CategoryForm
        category={editingCategory}
        categories={initialCategories}
        open={isFormOpen}
        onOpenChange={handleCloseForm}
      />
    </div>
  )
}
