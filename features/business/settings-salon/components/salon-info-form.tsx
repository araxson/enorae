'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ActionButton } from '@/features/shared/ui-components'
import { updateSalonInfo } from '@/features/business/settings-salon/api/mutations'

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
          <div className="flex flex-col gap-6">
            <div>
              <Label htmlFor="business_name">Business Name</Label>
              <Input
                id="business_name"
                name="business_name"
                defaultValue={businessName || salonName || ''}
                placeholder="e.g., Elite Hair & Beauty LLC"
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your legal business name (if different from salon name)
              </p>
            </div>

            <div>
              <Label htmlFor="business_type">Business Type</Label>
              <Input
                id="business_type"
                name="business_type"
                defaultValue={businessType || ''}
                placeholder="e.g., LLC, Corporation, Sole Proprietorship"
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your business entity type
              </p>
            </div>

            <div>
              <Label htmlFor="established_at">Established Date</Label>
              <Input
                id="established_at"
                name="established_at"
                type="date"
                defaultValue={establishedAt || ''}
              />
              <p className="text-xs text-muted-foreground mt-1">
                When your business was founded
              </p>
            </div>

            <div className="flex justify-end">
              <ActionButton
                onAction={handleSave}
                successMessage="Business information updated successfully"
                loadingText="Saving..."
              >
                Save Changes
              </ActionButton>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
