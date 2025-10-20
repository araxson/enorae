'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Stack } from '@/components/layout'
import { Badge } from '@/components/ui/badge'
import { productUsageSchema, type ProductUsageFormData } from '../schema'
import { recordProductUsage } from '../api/mutations'
import type { Product } from '../types'

interface ProductUsageFormProps {
  appointmentId: string
  locationId: string
  products: Product[]
  onSuccess?: () => void
  onCancel?: () => void
}

export function ProductUsageForm({
  appointmentId,
  locationId,
  products,
  onSuccess,
  onCancel
}: ProductUsageFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductUsageFormData>({
    resolver: zodResolver(productUsageSchema),
    defaultValues: {
      appointment_id: appointmentId,
      location_id: locationId,
      quantity_used: 1,
      notes: '',
    },
  })

  const productId = watch('product_id')

  const handleProductChange = (value: string) => {
    setValue('product_id', value)
    const product = products.find(p => p.id === value)
    setSelectedProduct(product || null)
  }

  const onSubmit = async (data: ProductUsageFormData) => {
    try {
      setIsSubmitting(true)
      setError(null)
      await recordProductUsage(data)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="md">
        <div>
          <Label htmlFor="product_id">Product</Label>
          <Select value={productId} onValueChange={handleProductChange}>
            <SelectTrigger id="product_id">
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id || ''} value={product.id || ''}>
                  {product.name} - {product.sku}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.product_id && (
            <p className="text-sm text-destructive mt-1">{errors.product_id.message}</p>
          )}
          {selectedProduct && (
            <div className="mt-2 flex gap-2">
              <Badge variant="outline">
                Cost: ${selectedProduct.cost_price}
              </Badge>
              <Badge variant="outline">
                {selectedProduct.unit_of_measure}
              </Badge>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="quantity_used">Quantity Used</Label>
          <Input
            id="quantity_used"
            type="number"
            step="0.01"
            min="0.01"
            {...register('quantity_used', { valueAsNumber: true })}
          />
          {errors.quantity_used && (
            <p className="text-sm text-destructive mt-1">{errors.quantity_used.message}</p>
          )}
          {selectedProduct && (
            <p className="text-sm text-muted-foreground mt-1">
              Unit: {selectedProduct.unit_of_measure}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Add notes about product usage"
            {...register('notes')}
          />
          {errors.notes && (
            <p className="text-sm text-destructive mt-1">{errors.notes.message}</p>
          )}
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Recording...' : 'Record Usage'}
          </Button>
        </div>
      </Stack>
    </form>
  )
}
