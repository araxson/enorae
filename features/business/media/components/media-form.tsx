'use client'

import { Button } from '@/components/ui/button'
import { Stack } from '@/components/layout'

import type { SalonMedia as SalonMediaRow } from '@/lib/types/app.types'

import { BrandColorsSection } from './media-form/brand-colors-section'
import { GallerySection } from './media-form/gallery-section'
import { PrimaryImagesSection } from './media-form/primary-images-section'
import { SocialLinksSection } from './media-form/social-links-section'
import { useMediaForm } from './media-form/use-media-form'

type SalonMedia = SalonMediaRow

type MediaFormProps = {
  salonId: string
  media: SalonMedia | null
}

export function MediaForm({ media }: Omit<MediaFormProps, 'salonId'>) {
  const { state, actions, handlers } = useMediaForm({ media })

  return (
    <form onSubmit={handlers.handleSubmit}>
      <Stack gap="lg">
        <PrimaryImagesSection logoUrl={state.logoUrl} coverImageUrl={state.coverImageUrl} />

        <GallerySection
          galleryUrls={state.galleryUrls}
          newGalleryUrl={state.newGalleryUrl}
          isAddingImage={state.isAddingImage}
          onNewGalleryUrlChange={actions.setNewGalleryUrl}
          onAddImage={actions.handleAddImage}
          onRemoveImage={actions.handleRemoveImage}
        />

        <BrandColorsSection brandColors={state.brandColors} />

        <SocialLinksSection socialLinks={state.socialLinks} />

        <div className="flex justify-end">
          <Button type="submit" disabled={state.isSubmitting}>
            {state.isSubmitting ? 'Saving...' : 'Save Media'}
          </Button>
        </div>
      </Stack>
    </form>
  )
}
