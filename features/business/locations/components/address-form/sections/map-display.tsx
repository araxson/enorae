'use client'

import { Card, CardContent } from '@/components/ui/card'
import { EXTERNAL_APIS } from '@/lib/config/env'
import type { LocationAddress } from '@/features/business/locations/components/address-form/types'

type MapDisplayProps = {
  address: LocationAddress | null
}

export function MapDisplay({ address }: MapDisplayProps) {
  if (!address?.['latitude'] || !address?.['longitude'] || !EXTERNAL_APIS.GOOGLE_MAPS.isEnabled()) {
    return null
  }

  return (
    <Card>
      <CardContent className="p-0">
        <iframe
          width="100%"
          height="300"
          className="w-full border-0"
          loading="lazy"
          src={`${EXTERNAL_APIS.GOOGLE_MAPS.EMBED_URL}?q=${address['latitude']},${address['longitude']}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
          title="Location Map"
        />
      </CardContent>
    </Card>
  )
}
