'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AspectRatio } from '@/components/ui/aspect-ratio'

interface PhotoGalleryProps {
  images: string[]
  logoUrl?: string | null
  coverUrl?: string | null
  className?: string
}

export function PhotoGallery({ images: galleryUrls, logoUrl, coverUrl, className }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  // Combine all images: cover, logo, then gallery
  const allImages = [
    ...(coverUrl ? [coverUrl] : []),
    ...(logoUrl ? [logoUrl] : []),
    ...galleryUrls,
  ].filter(Boolean)

  if (allImages.length === 0) {
    return null
  }

  const openLightbox = (index: number) => {
    setSelectedIndex(index)
  }

  const closeLightbox = () => {
    setSelectedIndex(null)
  }

  const goToPrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1)
    }
  }

  const goToNext = () => {
    if (selectedIndex !== null && selectedIndex < allImages.length - 1) {
      setSelectedIndex(selectedIndex + 1)
    }
  }

  return (
    <>
      <div className={cn('grid gap-2', className)}>
        {allImages[0] ? (
          <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg">
            <button
              type="button"
              onClick={() => openLightbox(0)}
              className="relative block h-full w-full cursor-pointer"
            >
              <Image
                src={allImages[0]}
                alt="Salon photo"
                fill
                className="object-cover transition-transform hover:scale-105"
              />
            </button>
          </AspectRatio>
        ) : null}

        {allImages.length > 1 ? (
          <div className="grid grid-cols-4 gap-2">
            {allImages.slice(1, 5).map((image, index) => (
              <AspectRatio
                key={`${image}-${index}`}
                ratio={1}
                className="overflow-hidden rounded-lg"
              >
                <button
                  type="button"
                  onClick={() => openLightbox(index + 1)}
                  className="group relative block h-full w-full cursor-pointer"
                >
                  <Image
                    src={image}
                    alt={`Salon photo ${index + 2}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  {index === 3 && allImages.length > 5 ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 text-foreground">
                      +{allImages.length - 5} more
                    </div>
                  ) : null}
                </button>
              </AspectRatio>
            ))}
          </div>
        ) : null}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={selectedIndex !== null} onOpenChange={(open) => !open && closeLightbox()}>
        <DialogContent className="max-w-4xl p-0">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-10"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <X className="size-4" />
            </Button>

            {selectedIndex !== null && (
              <>
                <div className="relative aspect-video w-full">
                  <Image
                    src={allImages[selectedIndex] ?? ''}
                    alt={`Salon photo ${selectedIndex + 1}`}
                    fill
                    className="object-contain"
                  />
                </div>

                {allImages.length > 1 && (
                  <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between p-4">
                    <div className="rounded-full bg-background/80 p-1 shadow-sm backdrop-blur-sm">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={goToPrevious}
                        disabled={selectedIndex === 0}
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="size-6" />
                      </Button>
                    </div>
                    <div className="rounded-full bg-background/80 p-1 shadow-sm backdrop-blur-sm">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={goToNext}
                        disabled={selectedIndex === allImages.length - 1}
                        aria-label="Next image"
                      >
                        <ChevronRight className="size-6" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="bg-background/90 p-2 text-center text-sm text-foreground">
                  {selectedIndex + 1} / {allImages.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
