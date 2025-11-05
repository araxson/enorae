import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function DashboardAnalyticsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Loading analytics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-5 w-1/3" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
        </div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      </CardContent>
    </Card>
  )
}
