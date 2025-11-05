import { Skeleton } from '@/components/ui/skeleton'
import { NotificationCenterSkeleton } from '@/features/shared/notifications'

export function CustomerNotificationsSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="flex items-center gap-3">
        <Skeleton className="size-5 rounded-full" />
        <Skeleton className="h-5 w-44" />
      </div>
      <NotificationCenterSkeleton />
    </div>
  )
}
