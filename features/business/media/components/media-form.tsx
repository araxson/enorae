'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Stack, Grid } from '@/components/layout'
import { H3, Muted } from '@/components/ui/typography'
import { updateSalonMedia, addGalleryImage, removeGalleryImage } from '../api/mutations'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'
import Image from 'next/image'

type SalonMedia = Database['organization']['Tables']['salon_media']['Row']

interface MediaFormProps {
  salonId: string
  media: SalonMedia | null
}

export function MediaForm({ media }: Omit<MediaFormProps, 'salonId'>) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newGalleryUrl, setNewGalleryUrl] = useState('')
  const [isAddingImage, setIsAddingImage] = useState(false)
  const [galleryUrls, setGalleryUrls] = useState<string[]>(media?.gallery_urls || [])

  // Parse JSON fields
  type BrandColors = { primary: string; secondary: string; accent: string }
  type SocialLinks = { facebook: string; instagram: string; twitter: string; tiktok: string; website: string }

  const brandColors = (media?.brand_colors as BrandColors | null) || { primary: '', secondary: '', accent: '' }
  const socialLinks = (media?.social_links as SocialLinks | null) || {
    facebook: '',
    instagram: '',
    twitter: '',
    tiktok: '',
    website: '',
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    // Add JSON fields
    formData.set(
      'brand_colors',
      JSON.stringify({
        primary: formData.get('brand_primary'),
        secondary: formData.get('brand_secondary'),
        accent: formData.get('brand_accent'),
      })
    )

    formData.set(
      'social_links',
      JSON.stringify({
        facebook: formData.get('social_facebook'),
        instagram: formData.get('social_instagram'),
        twitter: formData.get('social_twitter'),
        tiktok: formData.get('social_tiktok'),
        website: formData.get('social_website'),
      })
    )

    formData.set('gallery_urls', JSON.stringify(galleryUrls))

    const result = await updateSalonMedia(formData)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Media updated successfully')
    }

    setIsSubmitting(false)
  }

  async function handleAddImage() {
    if (!newGalleryUrl.trim()) return

    setIsAddingImage(true)
    const formData = new FormData()
    formData.append('url', newGalleryUrl)
    const result = await addGalleryImage(formData)

    if (result.error) {
      toast.error(result.error)
    } else {
      setGalleryUrls([...galleryUrls, newGalleryUrl])
      setNewGalleryUrl('')
      toast.success('Image added to gallery')
    }

    setIsAddingImage(false)
  }

  async function handleRemoveImage(url: string) {
    const formData = new FormData()
    formData.append('url', url)
    const result = await removeGalleryImage(formData)

    if (result.error) {
      toast.error(result.error)
    } else {
      setGalleryUrls(galleryUrls.filter((u) => u !== url))
      toast.success('Image removed from gallery')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="lg">
        {/* Primary Images */}
        <Card className="p-6">
          <Stack gap="md">
            <H3>Primary Images</H3>
            <Grid cols={{ base: 1, md: 2 }} gap="md">
              <div>
                <Label htmlFor="logo_url">Logo URL</Label>
                <Input
                  id="logo_url"
                  name="logo_url"
                  type="url"
                  defaultValue={media?.logo_url ?? ''}
                  placeholder="https://example.com/logo.png"
                />
                <Muted>Your salon&apos;s logo (square format recommended)</Muted>
              </div>

              <div>
                <Label htmlFor="cover_image_url">Cover Image URL</Label>
                <Input
                  id="cover_image_url"
                  name="cover_image_url"
                  type="url"
                  defaultValue={media?.cover_image_url ?? ''}
                  placeholder="https://example.com/cover.jpg"
                />
                <Muted>Hero image for your salon page (16:9 recommended)</Muted>
              </div>
            </Grid>
          </Stack>
        </Card>

        {/* Gallery */}
        <Card className="p-6">
          <Stack gap="md">
            <H3>Photo Gallery</H3>

            <div className="flex gap-2">
              <Input
                value={newGalleryUrl}
                onChange={(e) => setNewGalleryUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                type="url"
              />
              <Button
                type="button"
                onClick={handleAddImage}
                disabled={isAddingImage || !newGalleryUrl.trim()}
              >
                Add
              </Button>
            </div>

            {galleryUrls.length > 0 ? (
              <Grid cols={{ base: 2, md: 3, lg: 4 }} gap="md">
                {galleryUrls.map((url, index) => (
                  <div key={index} className="relative group aspect-square">
                    <Image
                      src={url}
                      alt={`Gallery ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveImage(url)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </Grid>
            ) : (
              <Muted>No gallery images yet. Add your first image above.</Muted>
            )}
          </Stack>
        </Card>

        {/* Brand Colors */}
        <Card className="p-6">
          <Stack gap="md">
            <H3>Brand Colors</H3>
            <Grid cols={{ base: 1, md: 3 }} gap="md">
              <div>
                <Label htmlFor="brand_primary">Primary Color</Label>
                <Input
                  id="brand_primary"
                  name="brand_primary"
                  type="color"
                  defaultValue={brandColors.primary || '#000000'}
                />
              </div>

              <div>
                <Label htmlFor="brand_secondary">Secondary Color</Label>
                <Input
                  id="brand_secondary"
                  name="brand_secondary"
                  type="color"
                  defaultValue={brandColors.secondary || '#ffffff'}
                />
              </div>

              <div>
                <Label htmlFor="brand_accent">Accent Color</Label>
                <Input
                  id="brand_accent"
                  name="brand_accent"
                  type="color"
                  defaultValue={brandColors.accent || '#ff0000'}
                />
              </div>
            </Grid>
          </Stack>
        </Card>

        {/* Social Links */}
        <Card className="p-6">
          <Stack gap="md">
            <H3>Social Media Links</H3>
            <Grid cols={{ base: 1, md: 2 }} gap="md">
              <div>
                <Label htmlFor="social_facebook">Facebook</Label>
                <Input
                  id="social_facebook"
                  name="social_facebook"
                  type="url"
                  defaultValue={socialLinks.facebook || ''}
                  placeholder="https://facebook.com/yoursalon"
                />
              </div>

              <div>
                <Label htmlFor="social_instagram">Instagram</Label>
                <Input
                  id="social_instagram"
                  name="social_instagram"
                  type="url"
                  defaultValue={socialLinks.instagram || ''}
                  placeholder="https://instagram.com/yoursalon"
                />
              </div>

              <div>
                <Label htmlFor="social_twitter">Twitter</Label>
                <Input
                  id="social_twitter"
                  name="social_twitter"
                  type="url"
                  defaultValue={socialLinks.twitter || ''}
                  placeholder="https://twitter.com/yoursalon"
                />
              </div>

              <div>
                <Label htmlFor="social_tiktok">TikTok</Label>
                <Input
                  id="social_tiktok"
                  name="social_tiktok"
                  type="url"
                  defaultValue={socialLinks.tiktok || ''}
                  placeholder="https://tiktok.com/@yoursalon"
                />
              </div>

              <div>
                <Label htmlFor="social_website">Website</Label>
                <Input
                  id="social_website"
                  name="social_website"
                  type="url"
                  defaultValue={socialLinks.website || ''}
                  placeholder="https://yoursalon.com"
                />
              </div>
            </Grid>
          </Stack>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Media'}
          </Button>
        </div>
      </Stack>
    </form>
  )
}
