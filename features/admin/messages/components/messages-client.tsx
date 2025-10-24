'use client'

import { useMemo, useState } from 'react'
import type {
  MessageActivityPoint,
  MessageReportSummary,
  MessageStats,
  MessageThreadWithInsights,
  ModerationQueueItem,
} from '@/features/admin/messages/api/queries'
import { MessagesStats } from './messages-stats'
import { MessagesFilters } from './messages-filters'
import { MessagesTable } from './messages-table'
import { MessagesModerationTable } from './messages-moderation-table'
import { MessagesActivityTable } from './messages-activity-table'
import { MessagesReportSummary } from './messages-report-summary'

interface MessagesClientProps {
  threads: MessageThreadWithInsights[]
  stats: MessageStats
  moderationQueue: ModerationQueueItem[]
  activity: MessageActivityPoint[]
  reportSummary: MessageReportSummary
}

const normalise = (value: string) => value.toLowerCase()

export function MessagesClient({
  threads,
  stats,
  moderationQueue,
  activity,
  reportSummary,
}: MessagesClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | string>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | string>('all')
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false)

  const filteredThreads = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()

    return threads.filter((thread) => {
      const matchesSearch =
        !search ||
        thread.subject?.toLowerCase().includes(search) ||
        thread.customer_name?.toLowerCase().includes(search) ||
        thread.customer_email?.toLowerCase().includes(search) ||
        thread.salon_name?.toLowerCase().includes(search)

      const matchesStatus =
        statusFilter === 'all' ||
        normalise(thread.status ?? 'open') === normalise(statusFilter)

      const matchesPriority =
        priorityFilter === 'all' ||
        normalise(thread.priority ?? 'normal') === normalise(priorityFilter)

      const matchesFlagged = !showFlaggedOnly || thread.hasFlaggedMessages || thread.unresolvedReports > 0

      return matchesSearch && matchesStatus && matchesPriority && matchesFlagged
    })
  }, [threads, searchTerm, statusFilter, priorityFilter, showFlaggedOnly])

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="scroll-m-20 text-4xl font-extrabold">Messages Oversight</h1>
        <p className="text-muted-foreground">
          Monitor platform-wide communications, moderate flagged content, and track response performance.
        </p>
      </div>

      <MessagesStats stats={stats} />

      <MessagesFilters
        onSearch={setSearchTerm}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
        onFlaggedChange={setShowFlaggedOnly}
      />

      <MessagesTable threads={filteredThreads} />

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(320px,0.6fr)]">
        <MessagesModerationTable items={moderationQueue} />
        <MessagesReportSummary summary={reportSummary} />
      </div>

      <MessagesActivityTable activity={activity} />
    </div>
  )
}
