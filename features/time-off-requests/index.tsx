import { Section, Stack, Box, Flex, Grid } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { RequestCard } from './components/request-card'
import { getTimeOffRequests, getPendingTimeOffRequests } from './dal/time-off.queries'

export async function TimeOffRequests() {
  const [allRequests, pendingRequests] = await Promise.all([
    getTimeOffRequests(),
    getPendingTimeOffRequests(),
  ])

  return (
    <Section size="lg">
      <Stack gap="xl">
        <Flex justify="between" align="start">
          <Box>
            <H1>Time-Off Requests</H1>
            <P className="text-muted-foreground">Manage staff time-off requests</P>
          </Box>
          <Button>New Request</Button>
        </Flex>

        {pendingRequests.length > 0 && (
          <Box className="rounded-lg bg-secondary/10 p-4 border">
            <Small className="font-semibold">{pendingRequests.length} pending request(s) need review</Small>
          </Box>
        )}

        <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
          {allRequests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </Grid>
      </Stack>
    </Section>
  )
}
