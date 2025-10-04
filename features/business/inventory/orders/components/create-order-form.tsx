'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Stack, Flex } from '@/components/layout'
import { P, Muted } from '@/components/ui/typography'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { createPurchaseOrder } from '../api/mutations'
import type { Database } from '@/lib/types/database.types'

type Supplier = Database['public']['Views']['suppliers']['Row']
type Product = {
  id: string
  name: string | null
  cost_price: number | null
}

type OrderItem = {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
}

type CreateOrderFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  suppliers: Supplier[]
  products: Product[]
}

export function CreateOrderForm({ open, onOpenChange, suppliers, products }: CreateOrderFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [items, setItems] = useState<OrderItem[]>([])

  const handleAddItem = () => {
    setItems([
      ...items,
      { productId: '', productName: '', quantity: 1, unitPrice: 0 },
    ])
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleUpdateItem = (index: number, field: keyof OrderItem, value: unknown) => {
    const newItems = [...items]
    if (field === 'productId') {
      const product = products.find((p) => p.id === value)
      newItems[index].productId = value as string
      newItems[index].productName = product?.name || ''
      newItems[index].unitPrice = product?.cost_price || 0
    } else {
      newItems[index][field] = value as never
    }
    setItems(newItems)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.set('items', JSON.stringify(items))

    const result = await createPurchaseOrder(formData)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Purchase order created successfully')
      onOpenChange(false)
      setItems([])
      router.refresh()
    }

    setIsSubmitting(false)
  }

  const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Stack gap="lg">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="supplierId">
                  Supplier <span className="text-destructive">*</span>
                </Label>
                <Select name="supplierId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id!}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="orderDate">
                  Order Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="orderDate"
                  name="orderDate"
                  type="date"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <Label htmlFor="expectedDeliveryDate">Expected Delivery Date</Label>
                <Input
                  id="expectedDeliveryDate"
                  name="expectedDeliveryDate"
                  type="date"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Additional notes about this order..."
              />
            </div>

            <div>
              <Flex justify="between" align="center" className="mb-2">
                <P className="font-semibold">Order Items</P>
                <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </Flex>

              {items.length === 0 ? (
                <Card className="p-8 text-center">
                  <Muted>No items added yet. Click &quot;Add Item&quot; to get started.</Muted>
                </Card>
              ) : (
                <Stack gap="sm">
                  {items.map((item, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid gap-4 md:grid-cols-4 items-end">
                        <div>
                          <Label>Product</Label>
                          <Select
                            value={item.productId}
                            onValueChange={(value) => handleUpdateItem(index, 'productId', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.id!}>
                                  {product.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateItem(index, 'quantity', parseInt(e.target.value) || 1)
                            }
                          />
                        </div>

                        <div>
                          <Label>Unit Price</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.unitPrice}
                            onChange={(e) =>
                              handleUpdateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)
                            }
                          />
                        </div>

                        <div>
                          <Flex justify="between" align="center">
                            <div>
                              <Muted className="text-xs">Total</Muted>
                              <P className="font-semibold">
                                ${(item.quantity * item.unitPrice).toFixed(2)}
                              </P>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(index)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </Flex>
                        </div>
                      </div>
                    </Card>
                  ))}
                </Stack>
              )}
            </div>

            <Card className="p-4 bg-muted">
              <Flex justify="between" align="center">
                <P className="font-semibold">Total Order Amount</P>
                <P className="text-xl font-bold">${totalAmount.toFixed(2)}</P>
              </Flex>
            </Card>

            <Flex justify="end" gap="sm">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || items.length === 0}>
                {isSubmitting ? 'Creating...' : 'Create Purchase Order'}
              </Button>
            </Flex>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  )
}
