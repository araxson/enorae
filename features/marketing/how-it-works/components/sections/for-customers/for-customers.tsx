import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { forCustomersData } from './for-customers.data'

export function ForCustomers() {
  return (
    <section className="bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="scroll-m-20 text-3xl font-semibold">{forCustomersData.title}</h2>
          <p className="text-xl text-muted-foreground mt-4 text-muted-foreground">{forCustomersData.subtitle}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {forCustomersData.steps.map((step) => (
            <Card key={step.step}>
              <CardHeader>
                <Badge className="mb-2">Step {step.step}</Badge>
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
