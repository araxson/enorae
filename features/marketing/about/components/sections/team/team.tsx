import { Card, CardContent } from '@/components/ui/card'
import { teamData } from './team.data'

export function Team() {
  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 max-w-3xl mx-auto text-center">
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">{teamData.title}</h2>
          <p className="leading-7 text-lg">{teamData.description}</p>
        </div>

        <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
          {teamData.stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent>
                <div className="flex flex-col gap-2 text-center py-4">
                  <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
