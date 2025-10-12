'use client'

import { useMemo, useState } from 'react'
import { CalendarCheck2, CalendarX2 } from 'lucide-react'
import { StaffPageShell } from '@/features/staff/staff-common/components/staff-page-shell'
import type { StaffSummary, StaffQuickAction } from '@/features/staff/staff-common/components/types'
import { ScheduleManagementClient } from './schedule-management-client'
import { BlockedTimeForm } from '@/features/shared/blocked-times/components/blocked-time-form'
import { BlockedTimesList } from '@/features/shared/blocked-times/components/blocked-times-list'
import type { StaffScheduleWithStaff } from '../api/queries'
import type { getBlockedTimesByStaff } from '@/features/shared/blocked-times/api/queries'

type BlockedTime = Awaited<ReturnType<typeof getBlockedTimesByStaff>>

interface StaffScheduleClientProps {
  schedules: StaffScheduleWithStaff[]
  staffId: string
  salonId: string
  blockedTimes: BlockedTime
  staffName?: string | null
}

export function StaffScheduleClient({
  schedules,
  staffId,
  salonId,
  blockedTimes,
  staffName,
}: StaffScheduleClientProps) {
  const [activeTab, setActiveTab] = useState<'schedule' | 'blocked'>('schedule')

  const summaries: StaffSummary[] = useMemo(() => {
    const activeShifts = schedules.filter((schedule) => schedule.is_active).length
    const inactiveShifts = schedules.length - activeShifts
    const futureBlocks = blockedTimes.length

    return [
      {
        id: 'active-shifts',
        label: 'Active shifts',
        value: activeShifts.toString(),
        helper: 'Recurring each week',
        tone: activeShifts ? 'success' : 'warning',
      },
      {
        id: 'inactive-shifts',
        label: 'Inactive templates',
        value: inactiveShifts.toString(),
        helper: 'Saved but disabled',
        tone: 'info',
      },
      {
        id: 'blocked-times',
        label: 'Blocked windows',
        value: futureBlocks.toString(),
        helper: 'Upcoming blocked times',
        tone: futureBlocks ? 'warning' : 'default',
      },
    ]
  }, [blockedTimes.length, schedules])

  const quickActions: StaffQuickAction[] = [
    { id: 'add-schedule', label: 'Create shift', href: '#new-shift', icon: CalendarCheck2 },
    { id: 'blocked', label: 'Add blocked time', href: '#blocked-times', icon: CalendarX2 },
  ]

  const tabs = [
    { value: 'schedule', label: 'Weekly schedule', icon: CalendarCheck2 },
    { value: 'blocked', label: 'Blocked times', icon: CalendarX2, badge: blockedTimes.length ? blockedTimes.length.toString() : undefined },
  ]

  return (
    <StaffPageShell
      title="Schedule"
      description={staffName ? `Manage availability for ${staffName}` : 'Manage your availability and blocked windows.'}
      breadcrumbs={[
        { label: 'Staff', href: '/staff' },
        { label: 'Schedule' },
      ]}
      summaries={summaries}
      quickActions={quickActions}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(value) => setActiveTab(value as typeof activeTab)}
      toggles={[
        { id: 'auto-publish', label: 'Auto-publish updates', helper: 'Notify your salon when changes are saved', defaultOn: true },
      ]}
    >
      {activeTab === 'schedule' ? (
        <ScheduleManagementClient schedules={schedules} staffId={staffId} salonId={salonId} />
      ) : (
        <div className="space-y-6" id="blocked-times">
          <BlockedTimeForm salonId={salonId} />
          <BlockedTimesList blockedTimes={blockedTimes} />
        </div>
      )}
    </StaffPageShell>
  )
}
