'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Link2 } from 'lucide-react'
import type { ServicePairing } from './types'

export function ServicePairingsCard({ pairings }: { pairings: ServicePairing[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Link2 className="h-5 w-5" />
          <CardTitle>Service Pairings</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {pairings.map((pair) => (
          <div key={`${pair.primary}-${pair.paired}`} className="flex items-center justify-between rounded-md border px-3 py-2">
            <div>
              <p className="text-base font-medium">{pair.primary}</p>
              <p className="text-xs text-muted-foreground">Often paired with {pair.paired}</p>
            </div>
            <Badge variant="secondary">{pair.count} combos</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
