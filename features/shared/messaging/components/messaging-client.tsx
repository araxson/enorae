'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Stack, Flex, Box } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'
import { ThreadList } from './thread-list'
import { CreateThreadDialog } from './create-thread-dialog'

interface MessagingClientProps {
  threads: Array<{
    id: string
    salon_id: string
    subject: string | null
    status: string
    priority: string
    updated_at: string
  }>
  salonId?: string
}

export function MessagingClient({ threads, salonId }: MessagingClientProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <Stack gap="xl">
      <Flex justify="between" align="start">
        <Box>
          <H1>Messages</H1>
          <P className="text-muted-foreground">
            Communicate with salons about your appointments
          </P>
        </Box>
        {salonId && (
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Conversation
          </Button>
        )}
      </Flex>

      <Separator />

      <ThreadList threads={threads} />

      {salonId && (
        <CreateThreadDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          salonId={salonId}
        />
      )}
    </Stack>
  )
}
