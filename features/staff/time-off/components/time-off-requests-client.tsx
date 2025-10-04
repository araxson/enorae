'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Section, Stack, Box, Flex, Grid } from '@/components/layout'
import { H1, P, Small } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { RequestCard } from './request-card'
import { CreateRequestDialog } from './create-request-dialog'
import type { TimeOffRequestWithStaff } from '../api/queries'

interface TimeOffRequestsClientProps {
  staffId: string
  allRequests: TimeOffRequestWithStaff[]
  pendingRequests: TimeOffRequestWithStaff[]
}

export function TimeOffRequestsClient({
  staffId,
  allRequests,
  pendingRequests,
}: TimeOffRequestsClientProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <Section size="lg">
      <Stack gap="xl">
        <Flex justify="between" align="start">
          <Box>
            <H1>Time-Off Requests</H1>
            <P className="text-muted-foreground">Manage your time-off requests</P>
          </Box>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </Flex>

        {pendingRequests.length > 0 && (
          <Box className="rounded-lg bg-secondary/10 p-4 border">
            <Small className="font-semibold">
              {pendingRequests.length} pending request(s) awaiting review
            </Small>
          </Box>
        )}

        {allRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
            <P className="text-muted-foreground">No time-off requests yet</P>
            <P className="text-sm text-muted-foreground mt-2">
              Click &quot;New Request&quot; to submit a time-off request
            </P>
          </div>
        ) : (
          <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
            {allRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </Grid>
        )}

        <CreateRequestDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          staffId={staffId}
        />
      </Stack>
    </Section>
  )
}
