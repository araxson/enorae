import { NotFoundPage } from '@/features/shared/ui'

export default function AdminNotFound() {
  return (
    <NotFoundPage
      title="Page Not Found"
      description="The admin page you're looking for doesn't exist or has been moved."
      backHref="/admin"
      backLabel="Back to Dashboard"
    />
  )
}
