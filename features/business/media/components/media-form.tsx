'use client'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

import type { SalonMedia as SalonMediaRow } from '@/features/business/locations'

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
      <div className="flex flex-col gap-8">
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
            {state.isSubmitting ? (
              <>
                <Spinner />
                Saving
              </>
            ) : (
              'Save Media'
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
