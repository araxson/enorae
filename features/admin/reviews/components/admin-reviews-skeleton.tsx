import { Skeleton } from '@/components/ui/skeleton'
import { AdminSection } from '@/features/admin/common/components'

export function AdminReviewsSkeleton() {
  return (
    <AdminSection>
      <div className="flex flex-col gap-10">
        <div className="flex justify-end">
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-[480px]" />
      </div>
    </AdminSection>
  )
}
