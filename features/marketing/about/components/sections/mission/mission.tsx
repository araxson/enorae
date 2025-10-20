import { Section, Stack, Grid } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { missionData } from './mission.data'

export function Mission() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <Stack gap="md" className="max-w-3xl mx-auto text-center">
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">{missionData.title}</h2>
          <p className="leading-7 text-lg">{missionData.description}</p>
        </Stack>

        <Grid cols={{ base: 1, md: 3 }} gap="lg">
          {missionData.goals.map((goal) => (
            <Card key={goal.title}>
              <CardHeader>
                <CardTitle>{goal.title}</CardTitle>
                <CardDescription>{goal.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Section>
  )
}
