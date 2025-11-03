import { memo, type FormEvent } from 'react'
import type { CouponFormState } from '../api/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  isLoading: boolean
  isEditing: boolean
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onGenerateCode: () => void
  onFormDataChange: (update: CouponFormState | ((current: CouponFormState) => CouponFormState)) => void
  onToggleService: (serviceId: string, checked: boolean) => void
}

export const CouponFormFields = memo(function CouponFormFields({
  formData,
  services,
  isLoading,
  isEditing,
  onSubmit,
  onGenerateCode,
  onFormDataChange,
  onToggleService,
}: CouponFormFieldsProps) {
  return (
    <form onSubmit={onSubmit}>
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="discount">Discount</TabsTrigger>
          <TabsTrigger value="limits">Limits</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="activation">Activation</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="basic">
            <CouponBasicSection
              formData={formData}
              onChange={onFormDataChange}
              onGenerateCode={onGenerateCode}
            />
          </TabsContent>

          <TabsContent value="discount">
            <CouponDiscountSection formData={formData} onChange={onFormDataChange} />
          </TabsContent>

          <TabsContent value="limits">
            <CouponLimitsSection formData={formData} onChange={onFormDataChange} />
          </TabsContent>

          <TabsContent value="services">
            <CouponServicesSection
              services={services}
              selectedServiceIds={formData.applicable_services}
              onToggleService={onToggleService}
            />
          </TabsContent>

          <TabsContent value="customers">
            <CouponCustomersSection formData={formData} onChange={onFormDataChange} />
          </TabsContent>

          <TabsContent value="activation">
            <CouponActivationSection formData={formData} onChange={onFormDataChange} />
          </TabsContent>
        </div>

        <div className="mt-6">
          <CouponSubmitSection isLoading={isLoading} isEditing={isEditing} />
        </div>
      </Tabs>
    </form>
  )
})
