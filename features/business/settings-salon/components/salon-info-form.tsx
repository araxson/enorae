'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { ActionButton } from '@/features/shared/ui-components'
import { updateSalonInfo } from '@/features/business/settings-salon/api/mutations'
import { settingsSalonSchema, type SettingsSalonSchema } from '@/features/business/settings-salon/api/schema'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

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
  const [error, setError] = useState<string | null>(null)

  const form = useForm<SettingsSalonSchema>({
    resolver: zodResolver(settingsSalonSchema),
    defaultValues: {
      business_name: businessName || salonName || '',
      business_type: businessType || '',
      established_at: establishedAt ? new Date(establishedAt) : undefined,
    },
  })

  const handleSave = async (values: SettingsSalonSchema) => {
    setError(null)

    const formData = new FormData()
    formData.append('business_name', values.business_name)
    if (values.business_type && values.business_type.trim().length > 0) {
      formData.append('business_type', values.business_type)
    }
    if (values.established_at) {
      formData.append('established_at', values.established_at.toISOString())
    }

    const result = await updateSalonInfo(salonId, formData)

    if (result.error) {
      setError(result.error)
      throw new Error(result.error)
    }
  }

  return (
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader>
        <div className="flex flex-col gap-1">
          <ItemTitle>Business Information</ItemTitle>
          <ItemDescription>
            Update your salon&apos;s business details and legal information
          </ItemDescription>
        </div>
      </ItemHeader>
      <ItemContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)}>
            <FieldSet className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="business_name"
                render={({ field }) => (
                  <FormItem>
                    <Field>
                      <FieldLabel htmlFor="business_name">Business Name</FieldLabel>
                      <FieldContent>
                        <FormControl>
                          <Input
                            id="business_name"
                            placeholder="e.g., Elite Hair & Beauty LLC"
                            maxLength={200}
                            {...field}
                          />
                        </FormControl>
                      </FieldContent>
                      <FieldDescription>
                        Your legal business name (if different from salon name).
                      </FieldDescription>
                      <FormMessage />
                    </Field>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="business_type"
                render={({ field }) => (
                  <FormItem>
                    <Field>
                      <FieldLabel htmlFor="business_type">Business Type</FieldLabel>
                      <FieldContent>
                        <FormControl>
                          <Input
                            id="business_type"
                            placeholder="e.g., LLC, Corporation, Sole Proprietorship"
                            maxLength={100}
                            {...field}
                          />
                        </FormControl>
                      </FieldContent>
                      <FieldDescription>Your business entity type.</FieldDescription>
                      <FormMessage />
                    </Field>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="established_at"
                render={({ field }) => (
                  <FormItem>
                    <Field>
                      <FieldLabel htmlFor="established_at">Established Date</FieldLabel>
                      <FieldContent>
                        <FormControl>
                          <Input
                            id="established_at"
                            type="date"
                            value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                          />
                        </FormControl>
                      </FieldContent>
                      <FieldDescription>When your business was founded.</FieldDescription>
                      <FormMessage />
                    </Field>
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <ActionButton
                  onAction={() => form.handleSubmit(handleSave)()}
                  successMessage="Business information updated successfully"
                  loadingText="Saving..."
                  disabled={form.formState.isSubmitting}
                >
                  Save Changes
                </ActionButton>
              </div>
            </FieldSet>
          </form>
        </Form>
      </ItemContent>
    </Item>
  )
}
