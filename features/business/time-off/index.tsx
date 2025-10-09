import { Section, Stack, Box, Grid } from '@/components/layout'
import { Small } from '@/components/ui/typography'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TimeOffRequestCard } from './components/time-off-request-card'
import { getSalonTimeOffRequests, getPendingSalonTimeOffRequests } from './api/queries'
import { approveTimeOffRequest, rejectTimeOffRequest } from './api/mutations'

export async function BusinessTimeOff() {
  let allRequests, pendingRequests

  try {
    ;[allRequests, pendingRequests] = await Promise.all([
      getSalonTimeOffRequests(),
      getPendingSalonTimeOffRequests(),
    ])
  } catch (error) {
    return (
      <Section size="lg">
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load time-off requests'}
          </AlertDescription>
        </Alert>
      </Section>
    )
  }

  return (
    <Section size="lg">
      <Stack gap="xl">
        {pendingRequests.length > 0 && (
          <Box className="rounded-lg bg-secondary/10 p-4 border">
            <Small className="font-semibold">
              {pendingRequests.length} pending request{pendingRequests.length !== 1 ? 's' : ''} need review
            </Small>
          </Box>
        )}

        {allRequests.length === 0 ? (
          <Alert>
            <AlertDescription>No time-off requests found</AlertDescription>
          </Alert>
        ) : (
          <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
            {allRequests.map((request) => (
              <TimeOffRequestCard
                key={request.id}
                request={request}
                onApprove={approveTimeOffRequest}
                onReject={rejectTimeOffRequest}
              />
            ))}
          </Grid>
        )}
      </Stack>
    </Section>
  )
}
