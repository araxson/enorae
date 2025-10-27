import { Item, ItemContent, ItemDescription, ItemGroup } from '@/components/ui/item'
import { Hero } from '@/features/marketing/contact/sections/hero'
import { Form } from '@/features/marketing/contact/sections/form'
import { Info } from '@/features/marketing/contact/sections/info'

export function ContactPage() {
  return (
    <ItemGroup className="gap-12">
      <Item className="flex-col items-center text-center" variant="muted">
        <ItemContent>
          <ItemDescription>Reach our team directly or share details with the contact form below.</ItemDescription>
        </ItemContent>
      </Item>
      <Hero />
      <section className="bg-background">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:px-8">
          <Form />
          <Info />
        </div>
      </section>
    </ItemGroup>
  )
}
