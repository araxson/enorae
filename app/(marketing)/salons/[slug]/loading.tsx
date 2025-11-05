import { Spinner } from '@/components/ui/spinner'

export default function Loading() {
  return (
    <div className="flex items-center justify-center py-12">
      <Spinner className="size-8" />
      <span className="sr-only">Loading salon details...</span>
    </div>
  )
}
