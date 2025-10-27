import { Suspense } from 'react'

import { Spinner } from '@/components/ui/spinner'
import { SignupPage } from '@/features/shared/auth'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Sign Up',
  description: 'Create your Enorae account to start booking salon appointments.',
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
      <SignupPage />
    </Suspense>
  )
}
