import { Suspense } from 'react'

import { Spinner } from '@/components/ui/spinner'
import { LoginPage } from '@/features/shared/auth'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Login',
  description: 'Login to your Enorae account to manage appointments and bookings.',
  noIndex: true,
})

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      }
    >
      <LoginPage />
    </Suspense>
  )
}
