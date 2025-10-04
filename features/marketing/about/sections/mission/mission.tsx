import { Section, Stack, Grid } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { H2, P } from '@/components/ui/typography'
import { missionData } from './mission.data'

export function Mission() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <Stack gap="md" className="max-w-3xl mx-auto text-center">
          <H2>{missionData.title}</H2>
          <P className="text-lg">{missionData.description}</P>
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
