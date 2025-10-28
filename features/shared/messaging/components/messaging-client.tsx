'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'
import { Separator } from '@/components/ui/separator'
import { CreateThreadDialog } from './create-thread-dialog'
import { ThreadList } from './thread-list'

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
        <ItemGroup className="gap-2">
          <Item variant="muted" className="flex-col items-start gap-2">
            <ItemContent>
              <ItemTitle>Messages</ItemTitle>
              <ItemDescription>
                Communicate with salons about your appointments.
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
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
