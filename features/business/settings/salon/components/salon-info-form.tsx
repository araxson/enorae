'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Stack } from '@/components/layout'
import { updateSalonInfo } from '../api/mutations'
import { toast } from 'sonner'

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
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await updateSalonInfo(salonId, formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Business information updated successfully')
      }
    } catch (error) {
      toast.error('Failed to update business information')
      console.error('Error updating salon info:', error)
    } finally {
      setIsSubmitting(false)
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
        <form onSubmit={handleSubmit}>
          <Stack gap="lg">
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </Stack>
        </form>
      </CardContent>
    </Card>
  )
}
