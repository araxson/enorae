'use client'

import type { Ref } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

import type { FieldProps } from './types'

export function BasicInfoFields({ errors, ref }: FieldProps) {
    const prefixError = errors?.['prefix']?.[0]
    const countError = errors?.['count']?.[0]
    const discountTypeError = errors?.['discount_type']?.[0]
    const descriptionError = errors?.['description']?.[0]

    return (
      <FieldGroup className="grid gap-4">
        {/* Prefix */}
        <Field>
          <FieldLabel htmlFor="prefix">
            Code Prefix
            <span className="text-destructive" aria-label="required"> *</span>
          </FieldLabel>
          <FieldContent>
            <Input
              ref={ref}
              id="prefix"
              name="prefix"
              type="text"
              required
              aria-required="true"
              aria-invalid={!!prefixError}
              aria-describedby={prefixError ? 'prefix-error prefix-hint' : 'prefix-hint'}
              maxLength={6}
              placeholder="SAVE"
              defaultValue="SAVE"
              className={prefixError ? 'border-destructive' : ''}
            />
            <FieldDescription id="prefix-hint">
              Prefix will be combined with random characters for uniqueness (2-6 characters, uppercase letters/numbers only).
            </FieldDescription>
            {prefixError && (
              <p id="prefix-error" className="text-sm text-destructive mt-1" role="alert">
                {prefixError}
              </p>
            )}
          </FieldContent>
        </Field>

        {/* Count */}
        <Field>
          <FieldLabel htmlFor="count">
            Quantity
            <span className="text-destructive" aria-label="required"> *</span>
          </FieldLabel>
          <FieldContent>
            <Input
              id="count"
              name="count"
              type="number"
              min={1}
              max={100}
              required
              aria-required="true"
              aria-invalid={!!countError}
              aria-describedby={countError ? 'count-error count-hint' : 'count-hint'}
              defaultValue={10}
              className={countError ? 'border-destructive' : ''}
            />
            <FieldDescription id="count-hint">
              Number of coupons to generate (1-100).
            </FieldDescription>
            {countError && (
              <p id="count-error" className="text-sm text-destructive mt-1" role="alert">
                {countError}
              </p>
            )}
          </FieldContent>
        </Field>

        {/* Description */}
        <Field>
          <FieldLabel htmlFor="description">
            Description
            <span className="text-destructive" aria-label="required"> *</span>
          </FieldLabel>
          <FieldContent>
            <Textarea
              id="description"
              name="description"
              required
              aria-required="true"
              aria-invalid={!!descriptionError}
              aria-describedby={descriptionError ? 'description-error' : undefined}
              rows={3}
              maxLength={500}
              placeholder="Seasonal promotion for returning customers"
              defaultValue="Seasonal promotion"
              className={descriptionError ? 'border-destructive' : ''}
            />
            {descriptionError && (
              <p id="description-error" className="text-sm text-destructive mt-1" role="alert">
                {descriptionError}
              </p>
            )}
          </FieldContent>
        </Field>

        {/* Discount Type */}
        <Field>
          <FieldLabel htmlFor="discount-type-percentage">
            Discount Type
            <span className="text-destructive" aria-label="required"> *</span>
          </FieldLabel>
          <FieldContent>
            <RadioGroup
              name="discount_type"
              defaultValue="percentage"
              required
              aria-required="true"
              aria-invalid={!!discountTypeError}
              aria-describedby={discountTypeError ? 'discount-type-error' : undefined}
              className="flex flex-wrap gap-3 pt-1"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem id="discount-type-percentage" value="percentage" />
                <FieldLabel htmlFor="discount-type-percentage" className="text-sm font-normal">
                  Percentage (%)
                </FieldLabel>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="discount-type-fixed" value="fixed" />
                <FieldLabel htmlFor="discount-type-fixed" className="text-sm font-normal">
                  Fixed Amount ($)
                </FieldLabel>
              </div>
            </RadioGroup>
            {discountTypeError && (
              <p id="discount-type-error" className="text-sm text-destructive mt-1" role="alert">
                {discountTypeError}
              </p>
            )}
          </FieldContent>
        </Field>
      </FieldGroup>
    )
}

/**
 * Discount value field
 */
