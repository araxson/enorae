import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { Database } from '@/lib/types/database.types'

type SalonDescription = Database['public']['Views']['salon_descriptions']['Row']

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
          {/* Welcome Message */}
          {description.welcome_message && (
            <Alert>
              <AlertTitle>Welcome message</AlertTitle>
              <AlertDescription>{description.welcome_message}</AlertDescription>
            </Alert>
          )}

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

          {/* Cancellation Policy */}
          {description.cancellation_policy && (
            <>
              <Separator />
              <div>
                <div className="mb-2 text-sm text-foreground">Cancellation Policy</div>
                <p className="whitespace-pre-line text-sm text-muted-foreground">{description.cancellation_policy}</p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
