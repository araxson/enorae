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
import { Empty, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { SessionSecurityTableRow } from './table-row'
import {
  quarantineSession,
  requireMfaForUser,
  evictSession,
} from '@/features/admin/session-security/api/mutations'
import type { SessionSecurityTableProps, SessionSecurityRecord } from './types'

/**
 * Session security monitoring table
 *
 * Displays session security records with actions:
 * - Quarantine sessions
 * - Require MFA for users
 * - Evict sessions
 */
export function SessionSecurityTable({ records }: SessionSecurityTableProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleQuarantine = async (sessionId: string, email: string) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('sessionId', sessionId)
      formData.append('reason', `Quarantine initiated by admin for ${email}`)
      const result = await quarantineSession(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Session quarantined')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequireMfa = async (userId: string, email: string) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('userId', userId)
      formData.append('reason', `MFA requirement enforced for ${email}`)
      const result = await requireMfaForUser(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('MFA requirement set')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleEvict = async (sessionId: string, email: string) => {
    if (!confirm(`Evict session for ${email}? This cannot be undone.`)) return
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('sessionId', sessionId)
      formData.append('reason', `Session evicted by admin for security`)
      const result = await evictSession(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Session evicted')
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
              <TableHead>Risk Score</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>MFA Status</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Security Flags</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <Empty>
                    <EmptyHeader>
                      <EmptyTitle>No session security records found</EmptyTitle>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              records.map((record: SessionSecurityRecord) => (
                <SessionSecurityTableRow
                  key={record.id}
                  record={record}
                  isLoading={isLoading}
                  onQuarantine={handleQuarantine}
                  onRequireMfa={handleRequireMfa}
                  onEvict={handleEvict}
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
          <span className="sr-only">Updating session security records</span>
        </div>
      ) : null}
    </div>
  )
}
