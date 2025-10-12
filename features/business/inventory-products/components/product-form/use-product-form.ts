'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { createProduct, updateProduct } from '../../api/mutations'
import type { ProductWithRelations } from '../../api/queries'

type ProductFormState = {
  name: string
  description: string
  sku: string
  category_id: string
  supplier_id: string
  cost_price: string
  retail_price: string
  reorder_point: string
  reorder_quantity: string
  unit_of_measure: string
  is_active: boolean
  is_tracked: boolean
}

type UseProductFormParams = {
  open: boolean
  salonId: string
  editProduct: ProductWithRelations | null | undefined
  onOpenChange: (open: boolean) => void
}

const INITIAL_STATE: ProductFormState = {
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
}

export function useProductForm({ open, salonId, editProduct, onOpenChange }: UseProductFormParams) {
  const [formData, setFormData] = useState<ProductFormState>(INITIAL_STATE)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) {
      return
    }

    if (editProduct) {
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
    } else {
      setFormData(INITIAL_STATE)
    }
  }, [open, editProduct])

  const updateField = <Key extends keyof ProductFormState>(key: Key, value: ProductFormState[Key]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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
        reorder_point: formData.reorder_point ? parseInt(formData.reorder_point, 10) : undefined,
        reorder_quantity: formData.reorder_quantity ? parseInt(formData.reorder_quantity, 10) : undefined,
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

  return {
    formData,
    updateField,
    loading,
    handleSubmit,
    onCancel: () => onOpenChange(false),
  }
}

export type ProductFormHook = ReturnType<typeof useProductForm>
