import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/auth'
import { getCustomerReviews } from './api/queries'
import { ReviewsList } from './components/reviews-list'
import { Section, Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'

export async function CustomerReviews() {
  const session = await verifySession()

  if (!session) {
    redirect('/login')
  }

  const reviews = await getCustomerReviews()

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <H1>My Reviews</H1>
          <P className="text-muted-foreground">
            Reviews you&apos;ve written for salons
          </P>
        </div>

        <Separator />

        <ReviewsList reviews={reviews} />
      </Stack>
    </Section>
  )
}
