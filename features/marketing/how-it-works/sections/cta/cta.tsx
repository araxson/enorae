import Link from 'next/link'
import { H2, P } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { ctaData } from './cta.data'

export function CTA() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="space-y-4">
          <H2>{ctaData.title}</H2>
          <P className="text-muted-foreground">{ctaData.description}</P>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {ctaData.buttons.map((button) => (
            <Button key={button.text} asChild variant={button.variant} size="lg" className="px-6">
              <Link href={button.href}>{button.text}</Link>
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}
