import { Suspense } from 'react'
import { SignupPage } from '@/features/shared/auth'
import { PageLoading } from '@/features/shared/ui-components'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({ title: 'Sign Up', description: 'Create your Enorae account to start booking salon appointments.', noIndex: true })

export default function Page() {
  return (
    <Suspense fallback={<PageLoading />}>
      <SignupPage />
    </Suspense>
  )
}
