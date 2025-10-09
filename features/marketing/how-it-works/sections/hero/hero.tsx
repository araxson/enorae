import { H1, Lead, P } from '@/components/ui/typography'
import { heroData } from './hero.data'

export function Hero() {
  return (
    <section className="bg-muted/30">
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <H1>{heroData.title}</H1>
            <Lead>{heroData.subtitle}</Lead>
          </div>
          <P className="text-lg text-muted-foreground">{heroData.description}</P>
        </div>
      </div>
    </section>
  )
}
