import type { FormEvent } from 'react'
import { Stack } from '@/components/layout'
import type { CouponFormState } from './coupon-form.types'
import { CouponBasicSection } from './coupon-form/basic-section'
import { CouponDiscountSection } from './coupon-form/discount-section'
import { CouponLimitsSection } from './coupon-form/limits-section'
import { CouponServicesSection } from './coupon-form/services-section'
import { CouponCustomersSection } from './coupon-form/customers-section'
import { CouponActivationSection } from './coupon-form/activation-section'
import { CouponSubmitSection } from './coupon-form/submit-section'

interface CouponFormFieldsProps {
  formData: CouponFormState
  services: { id: string; name: string }[]
  selectedServiceIds: Set<string>
  isLoading: boolean
  isEditing: boolean
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onGenerateCode: () => void
  onFormDataChange: (update: CouponFormState | ((current: CouponFormState) => CouponFormState)) => void
  onToggleService: (serviceId: string, checked: boolean) => void
}

export function CouponFormFields({
  formData,
  services,
  selectedServiceIds,
  isLoading,
  isEditing,
  onSubmit,
  onGenerateCode,
  onFormDataChange,
  onToggleService,
}: CouponFormFieldsProps) {
  return (
    <form onSubmit={onSubmit}>
      <Stack gap="lg">
        <CouponBasicSection
          formData={formData}
          onChange={onFormDataChange}
          onGenerateCode={onGenerateCode}
        />
        <CouponDiscountSection formData={formData} onChange={onFormDataChange} />
        <CouponLimitsSection formData={formData} onChange={onFormDataChange} />
        <CouponServicesSection
          services={services}
          selectedServiceIds={selectedServiceIds}
          onToggleService={onToggleService}
        />
        <CouponCustomersSection formData={formData} onChange={onFormDataChange} />
        <CouponActivationSection formData={formData} onChange={onFormDataChange} />
        <CouponSubmitSection isLoading={isLoading} isEditing={isEditing} />
      </Stack>
    </form>
  )
}
