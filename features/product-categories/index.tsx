'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Stack, Box, Flex } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'
import { CategoryList } from './components/category-list'
import { CategoryForm } from './components/category-form'
import type { ProductCategoryWithCounts } from './dal/product-categories.queries'

type ProductCategoriesProps = {
  initialCategories: ProductCategoryWithCounts[]
}

export function ProductCategories({ initialCategories }: ProductCategoriesProps) {
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
      <Flex align="center" justify="between">
        <Box>
          <H1>Product Categories</H1>
          <P className="text-muted-foreground mt-1">
            Organize your inventory with product categories
          </P>
        </Box>
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
