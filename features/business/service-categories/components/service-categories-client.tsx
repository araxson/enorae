'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import type { ServiceCategoryWithCounts } from '@/features/business/service-categories/api/queries'
import { CategoryForm } from './category-form'
import { CategoryList } from './category-list'

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
      <ItemGroup className="items-start justify-between gap-4">
        <Item variant="muted" className="flex-col items-start gap-2">
          <ItemContent>
            <ItemTitle>Service Categories</ItemTitle>
            <ItemDescription>Organize your services with categories</ItemDescription>
          </ItemContent>
        </Item>
        <ItemActions>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 size-4" />
            Add Category
          </Button>
        </ItemActions>
      </ItemGroup>

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
