import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { Salon } from '../types'

interface GalleryCardProps {
  salon: Salon
}

export function GalleryCard({ salon }: GalleryCardProps) {
  if (!salon.gallery_urls?.length) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
          {salon.gallery_urls.map((url: string, index: number) => (
            <div
              key={`${url}-${index}`}
              className="aspect-square w-full overflow-hidden rounded-lg bg-muted relative"
            >
              <Image src={url} alt={`Gallery ${index + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
