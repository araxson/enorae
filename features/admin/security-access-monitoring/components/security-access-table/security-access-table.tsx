'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { SecurityAccessTableRow } from './table-row'
import { getRiskColor } from './utils'
import {
  acknowledgeSecurityAlert,
  dismissSecurityAlert,
  suppressSecurityAlert,
} from '@/features/admin/security-access-monitoring/api/mutations'
import type { SecurityAccessTableProps } from './types'

/**
 * Security access monitoring table
 *
 * Displays security access records with actions:
 * - Acknowledge alerts
 * - Dismiss alerts
 * - Suppress alerts for configurable duration
 */
export function SecurityAccessTable({ records }: SecurityAccessTableProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAcknowledge = async (accessId: string) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('accessId', accessId)
      const result = await acknowledgeSecurityAlert(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Alert acknowledged')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDismiss = async (accessId: string) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('accessId', accessId)
      const result = await dismissSecurityAlert(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Alert dismissed')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuppress = async (
    accessId: string,
    reason: string,
    duration: '1hour' | '1day' | '1week' | 'permanent'
  ) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('accessId', accessId)
      formData.append('reason', reason)
      formData.append('duration', duration)
      const result = await suppressSecurityAlert(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Alert suppressed')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative" aria-busy={isLoading}>
      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Access Type</TableHead>
              <TableHead>Endpoint</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead className={getRiskColor(50)}>Risk Score</TableHead>
              <TableHead>Acknowledgement</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <Empty>
                    <EmptyHeader>
                      <EmptyTitle>No security access records found</EmptyTitle>
                      <EmptyDescription>
                        New sign-in alerts and escalations will appear once access events are
                        logged.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <SecurityAccessTableRow
                  key={record.id}
                  record={record}
                  isLoading={isLoading}
                  onAcknowledge={handleAcknowledge}
                  onDismiss={handleDismiss}
                  onSuppress={handleSuppress}
                />
              ))
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {isLoading ? (
        <div
          role="status"
          aria-live="polite"
          className="bg-background/70 absolute inset-0 z-10 flex items-center justify-center"
        >
          <Spinner className="size-6" />
          <span className="sr-only">Loading security access events</span>
        </div>
      ) : null}
    </div>
  )
}
