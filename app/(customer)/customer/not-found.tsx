import { NotFoundPage } from '@/components/shared/not-found-page'

export default function CustomerNotFound() {
  return (
    <NotFoundPage
      title="Page Not Found"
      description="The page you're looking for doesn't exist or has been moved."
      backHref="/customer"
      backLabel="Back to Dashboard"
      homeHref="/customer/salons"
      homeLabel="Browse Salons"
    />
  )
}
