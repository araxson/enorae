import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { forBusinessesData } from './for-businesses.data'

export function ForBusinesses() {
  return (
    <section className="bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="scroll-m-20 text-3xl font-semibold">{forBusinessesData.title}</h2>
          <p className="text-xl text-muted-foreground mt-4 text-muted-foreground">{forBusinessesData.subtitle}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {forBusinessesData.steps.map((step) => (
            <Card key={step.step}>
              <CardHeader>
                <Badge variant="secondary" className="mb-2">Step {step.step}</Badge>
                <CardTitle>{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
