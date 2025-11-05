import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function NotificationCenterSkeleton() {
  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="size-5 rounded-full" />
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-3 w-28" />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            {['All', 'Unread', 'Read', 'Email', 'SMS'].map((label) => (
              <TabsTrigger key={label} value={label.toLowerCase()}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          {['all', 'unread', 'read', 'email', 'sms'].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-start gap-4 rounded-lg border p-4">
                    <Skeleton className="size-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                    <Skeleton className="h-3 w-10" />
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
