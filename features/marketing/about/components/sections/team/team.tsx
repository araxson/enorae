import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { teamData } from './team.data'

export function Team() {
  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 max-w-3xl mx-auto text-center">
          <h2 className="scroll-m-20">{teamData.title}</h2>
          <p className="leading-7">{teamData.description}</p>
        </div>

        <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
          {teamData.stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="items-center justify-center">
                <CardTitle>{stat.value}</CardTitle>
                <CardDescription>{stat.label}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
