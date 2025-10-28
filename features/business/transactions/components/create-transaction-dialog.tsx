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
import { Spinner } from '@/components/ui/spinner'
import { createManualTransaction } from '@/features/business/transactions/api/mutations'
import { ButtonGroup } from '@/components/ui/button-group'
import { TransactionFormFields } from './transaction-form-fields'

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
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Record Manual Transaction</DialogTitle>
            <DialogDescription>
              Record a cash payment, refund, or adjustment that occurred outside the system
            </DialogDescription>
          </DialogHeader>

          <TransactionFormFields
            transactionType={transactionType}
            paymentMethod={paymentMethod}
            onTransactionTypeChange={setTransactionType}
            onPaymentMethodChange={setPaymentMethod}
            staffOptions={staffOptions}
            customerOptions={customerOptions}
            isSubmitting={isSubmitting}
          />

          <DialogFooter>
            <ButtonGroup>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner className="size-4" />
                    <span>Recording...</span>
                  </>
                ) : (
                  <span>Record Transaction</span>
                )}
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
