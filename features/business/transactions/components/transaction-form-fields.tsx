'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'

interface TransactionFormFieldsProps {
  transactionType: string
  paymentMethod: string
  onTransactionTypeChange: (value: string) => void
  onPaymentMethodChange: (value: string) => void
  staffOptions?: Array<{ id: string; full_name: string | null }>
  customerOptions?: Array<{ id: string; full_name: string | null; email?: string | null }>
  isSubmitting: boolean
}

export function TransactionFormFields({
  transactionType,
  paymentMethod,
  onTransactionTypeChange,
  onPaymentMethodChange,
  staffOptions = [],
  customerOptions = [],
  isSubmitting,
}: TransactionFormFieldsProps) {
  return (
    <FieldSet>
      <FieldGroup className="flex flex-col gap-6 my-6">
        <Field>
          <FieldLabel htmlFor="transactionAt">Transaction Date</FieldLabel>
          <FieldContent>
            <Input
              type="date"
              id="transactionAt"
              name="transactionAt"
              required
              max={new Date().toISOString().split('T')[0]}
              defaultValue={new Date().toISOString().split('T')[0]}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="transactionType">Transaction Type</FieldLabel>
          <FieldContent>
            <Select value={transactionType} onValueChange={onTransactionTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
                <SelectItem value="adjustment">Adjustment</SelectItem>
                <SelectItem value="fee">Fee</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="paymentMethod">Payment Method</FieldLabel>
          <FieldContent>
            <Select value={paymentMethod} onValueChange={onPaymentMethodChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
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
          </FieldContent>
        </Field>

        {staffOptions.length > 0 ? (
          <Field>
            <FieldLabel htmlFor="staffId">Staff Member (Optional)</FieldLabel>
            <FieldContent>
              <Select name="staffId" disabled={isSubmitting}>
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
            </FieldContent>
          </Field>
        ) : null}

        {customerOptions.length > 0 ? (
          <Field>
            <FieldLabel htmlFor="customerId">Customer (Optional)</FieldLabel>
            <FieldContent>
              <Select name="customerId" disabled={isSubmitting}>
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
            </FieldContent>
          </Field>
        ) : null}
      </FieldGroup>
    </FieldSet>
  )
}
