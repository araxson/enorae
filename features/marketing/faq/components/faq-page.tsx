import { Hero } from '@/features/marketing/faq/components/sections/hero'
import { Questions } from '@/features/marketing/faq/components/sections/questions'

export function FAQPage() {
  return (
    <div className="flex flex-col gap-0">
      <Hero />
      <Questions />
    </div>
  )
}
