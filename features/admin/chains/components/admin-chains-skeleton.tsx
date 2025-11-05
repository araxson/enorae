import { Skeleton } from '@/components/ui/skeleton'
import { AdminSection } from '@/features/admin/common/components'

export function AdminChainsSkeleton() {
  return (
    <AdminSection>
      <div className="flex flex-col gap-10">
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    </AdminSection>
  )
}
