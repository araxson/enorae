import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Stack } from '@/components/layout'

export function AppointmentsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        <div className="h-4 w-24 bg-muted rounded animate-pulse mt-2" />
      </CardHeader>
      <CardContent>
        <Stack gap="sm">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 rounded-lg border space-y-3 animate-pulse">
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-muted rounded" />
                <div className="h-6 w-28 bg-muted rounded" />
                <div className="h-6 w-24 bg-muted rounded" />
              </div>
              <div className="h-5 w-40 bg-muted rounded" />
              <div className="h-4 w-56 bg-muted rounded" />
            </div>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}
