import { Skeleton } from '@/components/ui/skeleton'

interface TableSkeletonProps {
  columns?: number
  rows?: number
}

const COLUMN_CLASS_MAP: Record<number, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
  5: 'sm:grid-cols-5',
  6: 'sm:grid-cols-6',
}

export function TableSkeleton({ columns = 4, rows = 5 }: TableSkeletonProps) {
  const columnClass = COLUMN_CLASS_MAP[columns] ?? COLUMN_CLASS_MAP[4]

  return (
    <div className="rounded-md border">
      <div className={`hidden gap-4 px-4 py-3 text-sm font-medium uppercase tracking-wide text-muted-foreground ${columnClass} sm:grid`}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-24" />
        ))}
      </div>
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className={`grid gap-4 px-4 py-3 ${columnClass}`}>
            {Array.from({ length: columns }).map((__, colIndex) => (
              <Skeleton key={colIndex} className="h-3 w-3/4" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
