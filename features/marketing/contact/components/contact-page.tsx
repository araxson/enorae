import { Hero } from '../components/sections/hero'
import { Form } from '../components/sections/form'
import { Info } from '../components/sections/info'

export function ContactPage() {
  return (
    <div className="space-y-0">
      <Hero />
      <section className="bg-background">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:px-8">
          <Form />
          <Info />
        </div>
      </section>
    </div>
  )
}
