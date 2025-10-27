'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ActionButton } from '@/features/shared/ui-components'
import { updateSalonInfo } from '@/features/business/settings-salon/api/mutations'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'

interface SalonInfoFormProps {
  salonId: string
  salonName: string | null
  businessName: string | null
  businessType: string | null
  establishedAt: string | null
}

export function SalonInfoForm({
  salonId,
  salonName,
  businessName,
  businessType,
  establishedAt,
}: SalonInfoFormProps) {
  const [formRef, setFormRef] = useState<HTMLFormElement | null>(null)

  const handleSave = async () => {
    if (!formRef) return

    const formData = new FormData(formRef)
    const result = await updateSalonInfo(salonId, formData)

    if (result.error) {
      throw new Error(result.error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
        <CardDescription>
          Update your salon&apos;s business details and legal information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={setFormRef}>
          <FieldSet className="flex flex-col gap-6">
            <Field>
              <FieldLabel htmlFor="business_name">Business Name</FieldLabel>
              <FieldContent>
                <Input
                  id="business_name"
                  name="business_name"
                  defaultValue={businessName || salonName || ''}
                  placeholder="e.g., Elite Hair & Beauty LLC"
                  maxLength={200}
                />
              </FieldContent>
              <FieldDescription>
                Your legal business name (if different from salon name).
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="business_type">Business Type</FieldLabel>
              <FieldContent>
                <Input
                  id="business_type"
                  name="business_type"
                  defaultValue={businessType || ''}
                  placeholder="e.g., LLC, Corporation, Sole Proprietorship"
                  maxLength={100}
                />
              </FieldContent>
              <FieldDescription>Your business entity type.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="established_at">Established Date</FieldLabel>
              <FieldContent>
                <Input
                  id="established_at"
                  name="established_at"
                  type="date"
                  defaultValue={establishedAt || ''}
                />
              </FieldContent>
              <FieldDescription>When your business was founded.</FieldDescription>
            </Field>

            <div className="flex justify-end">
              <ActionButton
                onAction={handleSave}
                successMessage="Business information updated successfully"
                loadingText="Saving..."
              >
                Save Changes
              </ActionButton>
            </div>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  )
}
