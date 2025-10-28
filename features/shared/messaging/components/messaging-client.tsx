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
        <div className="flex flex-col gap-2">
          <ItemGroup>
            <Item variant="muted">
              <ItemContent>
                <ItemTitle>Messages</ItemTitle>
                <ItemDescription>
                  Communicate with salons about your appointments.
                </ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </div>
        {salonId && (
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="size-4" />
            <span>New conversation</span>
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
