import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { Database } from '@/lib/types/database.types'

type SalonDescription = Database['public']['Views']['salons_view']['Row']

interface SalonDescriptionProps {
  description: SalonDescription
}

export function SalonDescriptionComponent({ description }: SalonDescriptionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          {/* Short Description */}
          {description.short_description && (
            <p className="text-foreground">{description.short_description}</p>
          )}

          {/* Full Description */}
          {description.full_description && (
            <>
              <Separator />
              <p className="whitespace-pre-line text-muted-foreground">{description.full_description}</p>
            </>
          )}

          {/* Note: Welcome message and cancellation policy not available in current database schema */}
        </div>
      </CardContent>
    </Card>
  )
}
