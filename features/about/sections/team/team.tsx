import { Section, Stack, Grid } from '@/components/layout'
import { Card, CardContent } from '@/components/ui/card'
import { H2, P, H3, Muted } from '@/components/ui/typography'
import { teamData } from './team.data'

export function Team() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <Stack gap="md" className="max-w-3xl mx-auto text-center">
          <H2>{teamData.title}</H2>
          <P className="text-lg">{teamData.description}</P>
        </Stack>

        <Grid cols={{ base: 2, md: 4 }} gap="lg">
          {teamData.stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent>
                <Stack gap="xs" className="text-center py-4">
                  <H3>{stat.value}</H3>
                  <Muted>{stat.label}</Muted>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Section>
  )
}
