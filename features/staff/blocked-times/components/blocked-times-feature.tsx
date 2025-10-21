'use client'

import { useState } from 'react'
import { Plus, List, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BlockedTimesList } from './blocked-times-list'
import { BlockedTimesCalendar } from './blocked-times-calendar'
import { BlockedTimeDialog } from './blocked-time-dialog'
import type { BlockedTime } from '../types'

interface BlockedTimesFeatureProps {
  blockedTimes: BlockedTime[]
}

export function BlockedTimesFeature({ blockedTimes }: BlockedTimesFeatureProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBlockedTime, setEditingBlockedTime] = useState<BlockedTime | undefined>()
  const [activeTab, setActiveTab] = useState('list')

  const handleEdit = (blockedTime: BlockedTime) => {
    setEditingBlockedTime(blockedTime)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingBlockedTime(undefined)
    setDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4 items-center justify-between">
        <h1 className="scroll-m-20 text-4xl font-extrabold lg:text-5xl">Blocked Times</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Blocked Time
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">
            <List className="mr-2 h-4 w-4" />
            List View
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <BlockedTimesList blockedTimes={blockedTimes} onEdit={handleEdit} />
        </TabsContent>

        <TabsContent value="calendar">
          <BlockedTimesCalendar blockedTimes={blockedTimes} />
        </TabsContent>
      </Tabs>

      <BlockedTimeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        blockedTime={editingBlockedTime}
      />
    </div>
  )
}
