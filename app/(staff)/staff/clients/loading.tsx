import { Spinner } from '@/components/ui/spinner'

export default function Loading() {
  return (
    <div className="flex items-center justify-center p-8">
      <Spinner className="h-8 w-8" aria-label="Loading clients..." />
    </div>
  )
}
