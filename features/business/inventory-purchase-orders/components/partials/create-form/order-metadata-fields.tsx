'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Supplier } from '../../types'

type Props = {
  suppliers: Supplier[]
}

export function OrderMetadataFields({ suppliers }: Props) {
  const today = new Date().toISOString().split('T')[0]

  return (
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
        <Input id="orderDate" name="orderDate" type="date" required defaultValue={today} />
      </div>

      <div>
        <Label htmlFor="expectedDeliveryDate">Expected Delivery Date</Label>
        <Input id="expectedDeliveryDate" name="expectedDeliveryDate" type="date" />
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={3} placeholder="Additional notes about this order..." />
      </div>
    </div>
  )
}
