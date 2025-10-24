import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { missionData } from './mission.data'

export function Mission() {
  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 max-w-3xl mx-auto text-center">
          <h2 className="scroll-m-20">{missionData.title}</h2>
          <p className="leading-7">{missionData.description}</p>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {missionData.goals.map((goal) => (
            <Card key={goal.title}>
              <CardHeader>
                <CardTitle>{goal.title}</CardTitle>
                <CardDescription>{goal.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
