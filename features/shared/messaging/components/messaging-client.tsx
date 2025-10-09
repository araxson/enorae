'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <H1 className="text-2xl font-semibold">Messages</H1>
          <P className="text-muted-foreground">
            Communicate with salons about your appointments.
          </P>
        </div>
        {salonId && (
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New conversation
          </Button>
        )}
      </div>

      <Separator />

      <ThreadList threads={threads} />

      {salonId && (
        <CreateThreadDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          salonId={salonId}
        />
      )}
    </div>
  )
}
