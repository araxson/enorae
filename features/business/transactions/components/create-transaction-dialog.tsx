'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Stack } from '@/components/layout'
import { createManualTransaction } from '../api/mutations'

interface CreateTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  staffOptions?: Array<{ id: string; full_name: string | null }>
  customerOptions?: Array<{ id: string; full_name: string | null; email?: string | null }>
}

export function CreateTransactionDialog({
  open,
  onOpenChange,
  staffOptions = [],
  customerOptions = [],
}: CreateTransactionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [transactionType, setTransactionType] = useState<string>('payment')
  const [paymentMethod, setPaymentMethod] = useState<string>('cash')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.append('transactionType', transactionType)
    formData.append('paymentMethod', paymentMethod)

    const result = await createManualTransaction(formData)

    if (result.success) {
      toast.success('Transaction recorded successfully')
      onOpenChange(false)
      ;(e.target as HTMLFormElement).reset()
      setTransactionType('payment')
      setPaymentMethod('cash')
    } else {
      toast.error(result.error || 'Failed to create transaction')
    }

    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Record Manual Transaction</DialogTitle>
            <DialogDescription>
              Record a cash payment, refund, or adjustment that occurred outside the system
            </DialogDescription>
          </DialogHeader>

          <Stack gap="lg" className="my-6">
            {/* Transaction Date */}
            <Stack gap="sm">
              <Label htmlFor="transactionAt">Transaction Date</Label>
              <Input
                type="date"
                id="transactionAt"
                name="transactionAt"
                required
                max={new Date().toISOString().split('T')[0]}
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </Stack>

            {/* Transaction Type */}
            <Stack gap="sm">
              <Label htmlFor="transactionType">Transaction Type</Label>
              <Select value={transactionType} onValueChange={setTransactionType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                  <SelectItem value="fee">Fee</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </Stack>

            {/* Payment Method */}
            <Stack gap="sm">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="debit_card">Debit Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="mobile_payment">Mobile Payment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </Stack>

            {/* Optional: Staff Member */}
            {staffOptions.length > 0 && (
              <Stack gap="sm">
                <Label htmlFor="staffId">Staff Member (Optional)</Label>
                <Select name="staffId">
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffOptions.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.full_name || 'Unknown'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Stack>
            )}

            {/* Optional: Customer */}
            {customerOptions.length > 0 && (
              <Stack gap="sm">
                <Label htmlFor="customerId">Customer (Optional)</Label>
                <Select name="customerId">
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customerOptions.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.full_name || customer.email || 'Unknown'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Stack>
            )}
          </Stack>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Recording...' : 'Record Transaction'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
