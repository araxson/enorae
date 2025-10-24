import { Hero } from '@/features/marketing/privacy/components/sections/hero'
import { Content } from '@/features/marketing/privacy/components/sections/content'

export function PrivacyPage() {
  return (
    <div className="flex flex-col gap-0">
      <Hero />
      <Content />
    </div>
  )
}
