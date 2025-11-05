import { Suspense } from 'react'
import { PageLoading } from '@/features/shared/ui'
import { FAQFeature, faqSEO } from '@/features/marketing/faq'

export const metadata = faqSEO

export default function Page() {
  return (
    <Suspense
      fallback={<PageLoading />}
    >
      <FAQFeature />
    </Suspense>
  )
}
