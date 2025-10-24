import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Heart, Lightbulb, Eye, Shield } from 'lucide-react'
import { valuesData } from './values.data'

const iconMap = {
  heart: Heart,
  lightbulb: Lightbulb,
  eye: Eye,
  shield: Shield,
} as const

export function Values() {
  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl bg-muted/30">
      <div className="flex flex-col gap-8">
        <h2 className="scroll-m-20 text-center">{valuesData.title}</h2>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {valuesData.values.map((value) => {
            const Icon = iconMap[value.icon as keyof typeof iconMap]
            return (
              <Card key={value.title}>
                <CardHeader>
                  <Icon className="h-8 w-8 mb-2" />
                  <CardTitle>{value.title}</CardTitle>
                  <CardDescription>{value.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
