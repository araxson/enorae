import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/auth'
import { getCustomerReviews } from './api/queries'
import { ReviewsList } from './components/reviews-list'
import { Separator } from '@/components/ui/separator'

export async function CustomerReviews() {
  const session = await verifySession()

  if (!session) {
    redirect('/login')
  }

  const reviews = await getCustomerReviews()

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <p className="leading-7 text-muted-foreground">
          Reviews you&apos;ve written for salons
        </p>

        <Separator />

        <ReviewsList reviews={reviews} />
      </div>
    </div>
  )
}
