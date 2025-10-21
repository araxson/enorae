import { Hero } from '../components/sections/hero'
import { Questions } from '../components/sections/questions'

export function FAQPage() {
  return (
    <div className="flex flex-col gap-0">
      <Hero />
      <Questions />
    </div>
  )
}
