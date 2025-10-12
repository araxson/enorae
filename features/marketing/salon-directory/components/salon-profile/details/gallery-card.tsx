import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Grid } from '@/components/layout'
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
        <Grid cols={{ base: 2, md: 3 }} gap="md">
          {salon.gallery_urls.map((url: string, index: number) => (
            <div
              key={`${url}-${index}`}
              className="aspect-square w-full overflow-hidden rounded-lg bg-muted relative"
            >
              <Image src={url} alt={`Gallery ${index + 1}`} fill className="object-cover" />
            </div>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}
