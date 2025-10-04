'use client'

import { useState, useEffect } from 'react'
import { Loader2, Package } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Stack, Grid } from '@/components/layout'
import { Muted } from '@/components/ui/typography'
import { createProduct, updateProduct } from '../api/mutations'
import type { ProductWithRelations } from '../api/queries'
import type { Database } from '@/lib/types/database.types'

type ProductCategory = Database['public']['Views']['product_categories']['Row']
type Supplier = Database['public']['Views']['suppliers']['Row']

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  salonId: string
  categories: ProductCategory[]
  suppliers: Supplier[]
  editProduct?: ProductWithRelations | null
}

export function ProductFormDialog({
  open,
  onOpenChange,
  salonId,
  categories,
  suppliers,
  editProduct,
}: ProductFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    category_id: '',
    supplier_id: '',
    cost_price: '',
    retail_price: '',
    reorder_point: '',
    reorder_quantity: '',
    unit_of_measure: '',
    is_active: true,
    is_tracked: true,
  })

  // Reset form when dialog opens/closes or when editProduct changes
  useEffect(() => {
    if (open && editProduct) {
      setFormData({
        name: editProduct.name || '',
        description: editProduct.description || '',
        sku: editProduct.sku || '',
        category_id: editProduct.category_id || '',
        supplier_id: editProduct.supplier_id || '',
        cost_price: editProduct.cost_price?.toString() || '',
        retail_price: editProduct.retail_price?.toString() || '',
        reorder_point: editProduct.reorder_point?.toString() || '',
        reorder_quantity: editProduct.reorder_quantity?.toString() || '',
        unit_of_measure: editProduct.unit_of_measure || '',
        is_active: editProduct.is_active ?? true,
        is_tracked: editProduct.is_tracked ?? true,
      })
    } else if (open && !editProduct) {
      setFormData({
        name: '',
        description: '',
        sku: '',
        category_id: '',
        supplier_id: '',
        cost_price: '',
        retail_price: '',
        reorder_point: '',
        reorder_quantity: '',
        unit_of_measure: '',
        is_active: true,
        is_tracked: true,
      })
    }
  }, [open, editProduct])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productData = {
        name: formData.name,
        description: formData.description || undefined,
        sku: formData.sku || undefined,
        category_id: formData.category_id || undefined,
        supplier_id: formData.supplier_id || undefined,
        cost_price: formData.cost_price ? parseFloat(formData.cost_price) : undefined,
        retail_price: formData.retail_price ? parseFloat(formData.retail_price) : undefined,
        reorder_point: formData.reorder_point ? parseInt(formData.reorder_point) : undefined,
        reorder_quantity: formData.reorder_quantity ? parseInt(formData.reorder_quantity) : undefined,
        unit_of_measure: formData.unit_of_measure || undefined,
        is_active: formData.is_active,
        is_tracked: formData.is_tracked,
      }

      const result = editProduct && editProduct.id
        ? await updateProduct(editProduct.id, productData)
        : await createProduct(salonId, productData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(`Product ${editProduct ? 'updated' : 'created'} successfully`)
        onOpenChange(false)
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {editProduct ? 'Update product details and inventory settings' : 'Add a new product to your inventory'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Stack gap="lg">
            {/* Basic Information */}
            <Stack gap="md">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Product Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Shampoo, Hair Color, Styling Gel"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Product description (optional)"
                  rows={3}
                />
              </div>

              <Grid cols={{ base: 1, md: 2 }} gap="md">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g., SHP-001"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit_of_measure">Unit of Measure</Label>
                  <Input
                    id="unit_of_measure"
                    value={formData.unit_of_measure}
                    onChange={(e) => setFormData({ ...formData, unit_of_measure: e.target.value })}
                    placeholder="e.g., bottle, tube, pack"
                  />
                </div>
              </Grid>
            </Stack>

            {/* Category & Supplier */}
            <Grid cols={{ base: 1, md: 2 }} gap="md">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c.id).map((category) => (
                      <SelectItem key={category.id!} value={category.id!}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Select
                  value={formData.supplier_id}
                  onValueChange={(value) => setFormData({ ...formData, supplier_id: value })}
                >
                  <SelectTrigger id="supplier">
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.filter(s => s.id).map((supplier) => (
                      <SelectItem key={supplier.id!} value={supplier.id!}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Grid>

            {/* Pricing */}
            <Grid cols={{ base: 1, md: 2 }} gap="md">
              <div className="space-y-2">
                <Label htmlFor="cost_price">Cost Price ($)</Label>
                <Input
                  id="cost_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cost_price}
                  onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="retail_price">Retail Price ($)</Label>
                <Input
                  id="retail_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.retail_price}
                  onChange={(e) => setFormData({ ...formData, retail_price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </Grid>

            {/* Reorder Settings - THE GAP WE'RE FIXING */}
            <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <Label className="font-semibold">Automatic Reorder Settings</Label>
              </div>
              <Muted className="text-sm">
                Set thresholds to automatically track when products need reordering
              </Muted>

              <Grid cols={{ base: 1, md: 2 }} gap="md">
                <div className="space-y-2">
                  <Label htmlFor="reorder_point">Reorder Point</Label>
                  <Input
                    id="reorder_point"
                    type="number"
                    step="1"
                    min="0"
                    value={formData.reorder_point}
                    onChange={(e) => setFormData({ ...formData, reorder_point: e.target.value })}
                    placeholder="e.g., 10"
                  />
                  <Muted className="text-xs">
                    Alert when stock falls below this level
                  </Muted>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reorder_quantity">Reorder Quantity</Label>
                  <Input
                    id="reorder_quantity"
                    type="number"
                    step="1"
                    min="0"
                    value={formData.reorder_quantity}
                    onChange={(e) => setFormData({ ...formData, reorder_quantity: e.target.value })}
                    placeholder="e.g., 50"
                  />
                  <Muted className="text-xs">
                    Suggested quantity to reorder
                  </Muted>
                </div>
              </Grid>
            </div>

            {/* Status Toggles */}
            <Grid cols={{ base: 1, md: 2 }} gap="md">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked as boolean })
                  }
                />
                <Label htmlFor="is_active" className="cursor-pointer">
                  Active Product
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_tracked"
                  checked={formData.is_tracked}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_tracked: checked as boolean })
                  }
                />
                <Label htmlFor="is_tracked" className="cursor-pointer">
                  Track Inventory
                </Label>
              </div>
            </Grid>
          </Stack>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
