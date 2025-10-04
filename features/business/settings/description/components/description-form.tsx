'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stack, Flex } from '@/components/layout'
import { H3, Muted } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { X } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'
import { updateSalonDescription, type DescriptionInput } from '../api/mutations'

type SalonDescription = Database['public']['Views']['salon_descriptions']['Row']

interface DescriptionFormProps {
  salonId: string
  description: SalonDescription | null
}

export function DescriptionForm({ salonId, description }: DescriptionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Array fields state
  const [amenities, setAmenities] = useState<string[]>(description?.amenities || [])
  const [specialties, setSpecialties] = useState<string[]>(description?.specialties || [])
  const [paymentMethods, setPaymentMethods] = useState<string[]>(description?.payment_methods || [])
  const [languages, setLanguages] = useState<string[]>(description?.languages_spoken || [])
  const [awards, setAwards] = useState<string[]>(description?.awards || [])
  const [certifications, setCertifications] = useState<string[]>(description?.certifications || [])
  const [keywords, setKeywords] = useState<string[]>(description?.meta_keywords || [])

  const handleAddItem = (value: string, setter: (items: string[]) => void, current: string[]) => {
    if (value.trim() && !current.includes(value.trim())) {
      setter([...current, value.trim()])
    }
  }

  const handleRemoveItem = (index: number, setter: (items: string[]) => void, current: string[]) => {
    setter(current.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)

    const input: DescriptionInput = {
      short_description: (formData.get('short_description') as string) || null,
      full_description: (formData.get('full_description') as string) || null,
      welcome_message: (formData.get('welcome_message') as string) || null,
      cancellation_policy: (formData.get('cancellation_policy') as string) || null,
      meta_title: (formData.get('meta_title') as string) || null,
      meta_description: (formData.get('meta_description') as string) || null,
      meta_keywords: keywords.length > 0 ? keywords : null,
      amenities: amenities.length > 0 ? amenities : null,
      specialties: specialties.length > 0 ? specialties : null,
      payment_methods: paymentMethods.length > 0 ? paymentMethods : null,
      languages_spoken: languages.length > 0 ? languages : null,
      awards: awards.length > 0 ? awards : null,
      certifications: certifications.length > 0 ? certifications : null,
    }

    const result = await updateSalonDescription(salonId, input)

    if (result.success) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError(result.error)
    }

    setIsSubmitting(false)
  }

  const ArrayInput = ({
    label,
    items,
    setter,
    placeholder,
  }: {
    label: string
    items: string[]
    setter: (items: string[]) => void
    placeholder: string
  }) => {
    const [inputValue, setInputValue] = useState('')

    return (
      <Stack gap="sm">
        <Label>{label}</Label>
        <Flex gap="sm">
          <Input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddItem(inputValue, setter, items)
                setInputValue('')
              }
            }}
            placeholder={placeholder}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              handleAddItem(inputValue, setter, items)
              setInputValue('')
            }}
          >
            Add
          </Button>
        </Flex>
        <Flex gap="sm" className="flex-wrap">
          {items.map((item, index) => (
            <Badge key={index} variant="secondary">
              {item}
              <button
                type="button"
                onClick={() => handleRemoveItem(index, setter, items)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </Flex>
      </Stack>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="xl">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>Description updated successfully!</AlertDescription>
          </Alert>
        )}

        {/* Descriptions */}
        <Card className="p-6">
          <Stack gap="lg">
            <H3>Descriptions</H3>
            <Separator />

            <Stack gap="sm">
              <Label htmlFor="short_description">Short Description</Label>
              <Textarea
                id="short_description"
                name="short_description"
                defaultValue={description?.short_description || ''}
                placeholder="A brief description of your salon (1-2 sentences)"
                rows={2}
              />
              <Muted>Used in search results and listings</Muted>
            </Stack>

            <Stack gap="sm">
              <Label htmlFor="full_description">Full Description</Label>
              <Textarea
                id="full_description"
                name="full_description"
                defaultValue={description?.full_description || ''}
                placeholder="Detailed description of your salon, services, and team"
                rows={6}
              />
            </Stack>

            <Stack gap="sm">
              <Label htmlFor="welcome_message">Welcome Message</Label>
              <Textarea
                id="welcome_message"
                name="welcome_message"
                defaultValue={description?.welcome_message || ''}
                placeholder="A friendly welcome message for visitors"
                rows={3}
              />
            </Stack>

            <Stack gap="sm">
              <Label htmlFor="cancellation_policy">Cancellation Policy</Label>
              <Textarea
                id="cancellation_policy"
                name="cancellation_policy"
                defaultValue={description?.cancellation_policy || ''}
                placeholder="Your cancellation and rescheduling policy"
                rows={4}
              />
            </Stack>
          </Stack>
        </Card>

        {/* SEO */}
        <Card className="p-6">
          <Stack gap="lg">
            <H3>SEO Metadata</H3>
            <Separator />

            <Stack gap="sm">
              <Label htmlFor="meta_title">Meta Title</Label>
              <Input
                id="meta_title"
                name="meta_title"
                defaultValue={description?.meta_title || ''}
                placeholder="Best Hair Salon in San Francisco | YourSalon"
                maxLength={60}
              />
              <Muted>Recommended: 50-60 characters</Muted>
            </Stack>

            <Stack gap="sm">
              <Label htmlFor="meta_description">Meta Description</Label>
              <Textarea
                id="meta_description"
                name="meta_description"
                defaultValue={description?.meta_description || ''}
                placeholder="Professional hair salon offering cuts, color, and styling services in San Francisco"
                rows={2}
                maxLength={160}
              />
              <Muted>Recommended: 150-160 characters</Muted>
            </Stack>

            <ArrayInput
              label="Meta Keywords"
              items={keywords}
              setter={setKeywords}
              placeholder="Add keyword (press Enter)"
            />
          </Stack>
        </Card>

        {/* Features & Amenities */}
        <Card className="p-6">
          <Stack gap="lg">
            <H3>Features & Amenities</H3>
            <Separator />

            <ArrayInput
              label="Amenities"
              items={amenities}
              setter={setAmenities}
              placeholder="e.g., WiFi, Parking, Refreshments"
            />

            <ArrayInput
              label="Specialties"
              items={specialties}
              setter={setSpecialties}
              placeholder="e.g., Balayage, Keratin Treatment, Extensions"
            />

            <ArrayInput
              label="Payment Methods"
              items={paymentMethods}
              setter={setPaymentMethods}
              placeholder="e.g., Cash, Credit Card, Apple Pay"
            />

            <ArrayInput
              label="Languages Spoken"
              items={languages}
              setter={setLanguages}
              placeholder="e.g., English, Spanish, Mandarin"
            />
          </Stack>
        </Card>

        {/* Awards & Certifications */}
        <Card className="p-6">
          <Stack gap="lg">
            <H3>Awards & Certifications</H3>
            <Separator />

            <ArrayInput
              label="Awards"
              items={awards}
              setter={setAwards}
              placeholder="e.g., Best Salon 2024, Top Rated by Yelp"
            />

            <ArrayInput
              label="Certifications"
              items={certifications}
              setter={setCertifications}
              placeholder="e.g., Redken Certified, Olaplex Certified"
            />
          </Stack>
        </Card>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Description'}
        </Button>
      </Stack>
    </form>
  )
}
