'use client'

import { Loader2 } from 'lucide-react'

import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Database } from '@/lib/types/database.types'

import { ProductBasicSection } from './product-basic-section'
import { ProductCategorizationSection } from './product-categorization-section'
import { ProductPricingSection } from './product-pricing-section'
import { ProductReorderSection } from './product-reorder-section'
import { ProductStatusSection } from './product-status-section'
import type { ProductFormHook } from './use-product-form'
import type { ProductWithRelations } from '../../api/queries'

type ProductCategory = Database['public']['Views']['product_categories']['Row']
type Supplier = Database['public']['Views']['suppliers']['Row']

type ProductFormContentProps = {
  categories: ProductCategory[]
  suppliers: Supplier[]
  editProduct: ProductWithRelations | null | undefined
} & ProductFormHook

export function ProductFormContent({
  categories,
  suppliers,
  editProduct,
  formData,
  updateField,
  loading,
  handleSubmit,
  onCancel,
}: ProductFormContentProps) {
  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{editProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <DialogDescription>
          {editProduct
            ? 'Update product details and inventory settings'
            : 'Add a new product to your inventory'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <ProductBasicSection
            name={formData.name}
            description={formData.description}
            sku={formData.sku}
            unitOfMeasure={formData.unit_of_measure}
            onNameChange={(value) => updateField('name', value)}
            onDescriptionChange={(value) => updateField('description', value)}
            onSkuChange={(value) => updateField('sku', value)}
            onUnitOfMeasureChange={(value) => updateField('unit_of_measure', value)}
          />

          <ProductCategorizationSection
            categories={categories}
            suppliers={suppliers}
            categoryId={formData.category_id}
            supplierId={formData.supplier_id}
            onCategoryChange={(value) => updateField('category_id', value)}
            onSupplierChange={(value) => updateField('supplier_id', value)}
          />

          <ProductPricingSection
            costPrice={formData.cost_price}
            retailPrice={formData.retail_price}
            onCostPriceChange={(value) => updateField('cost_price', value)}
            onRetailPriceChange={(value) => updateField('retail_price', value)}
          />

          <ProductReorderSection
            reorderPoint={formData.reorder_point}
            reorderQuantity={formData.reorder_quantity}
            onReorderPointChange={(value) => updateField('reorder_point', value)}
            onReorderQuantityChange={(value) => updateField('reorder_quantity', value)}
          />

          <ProductStatusSection
            isActive={formData.is_active}
            isTracked={formData.is_tracked}
            onActiveChange={(value) => updateField('is_active', value)}
            onTrackedChange={(value) => updateField('is_tracked', value)}
          />
        </div>

        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editProduct ? 'Update Product' : 'Add Product'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
