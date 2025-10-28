'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { MoreHorizontal } from 'lucide-react'
import type { RateLimitRule } from '@/features/admin/rate-limit-rules/api/queries'
import { toggleRateLimitRule, deleteRateLimitRule } from '@/features/admin/rate-limit-rules/api/mutations'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'

interface RateLimitRulesTableProps {
  rules: RateLimitRule[]
}

export function RateLimitRulesTable({ rules }: RateLimitRulesTableProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async (ruleId: string, currentActive: boolean) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('ruleId', ruleId)
      formData.append('isActive', (!currentActive).toString())
      const result = await toggleRateLimitRule(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(currentActive ? 'Rule disabled' : 'Rule enabled')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (ruleId: string, endpoint: string) => {
    if (!confirm(`Delete rule for ${endpoint}? This cannot be undone.`)) return
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('ruleId', ruleId)
      const result = await deleteRateLimitRule(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Rule deleted')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const formatWindowSeconds = (seconds: number | null | undefined) => {
    if (!seconds || Number.isNaN(seconds)) return '—'
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`
    return `${Math.round(seconds / 3600)}h`
  }

  return (
    <div className="relative" aria-busy={isLoading}>
      <ScrollArea className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Endpoint</TableHead>
            <TableHead>Limit</TableHead>
            <TableHead>Time Window</TableHead>
            <TableHead>Applies To</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7}>
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>No rate limit rules defined</EmptyTitle>
                    <EmptyDescription>Create a rule to enforce request policies for high-traffic endpoints.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </TableCell>
            </TableRow>
          ) : (
            rules.map((rule) => {
              const ruleKey = rule.id ?? `${rule.endpoint ?? 'unknown'}-${rule.rule_name ?? 'rule'}`
              const hasRuleId = typeof rule.id === 'string' && rule.id.length > 0

              return (
                <TableRow key={ruleKey}>
                  <TableCell className="font-mono text-sm">{rule.endpoint ?? '—'}</TableCell>
                  <TableCell className="font-semibold">{rule.max_requests ?? '—'}</TableCell>
                  <TableCell>{formatWindowSeconds(rule.window_seconds)}</TableCell>
                  <TableCell className="text-sm">{rule.applies_to ?? 'all'}</TableCell>
                  <TableCell>
                    <Switch
                      checked={Boolean(rule.is_active)}
                      onCheckedChange={() => hasRuleId && handleToggle(rule.id as string, Boolean(rule.is_active))}
                      disabled={isLoading || !hasRuleId}
                      aria-label={`Toggle rate limit rule for ${rule.endpoint} ${rule.is_active ? 'inactive' : 'active'}`}
                    />
                  </TableCell>
                  <TableCell className="text-sm">
                    {rule.created_at ? format(new Date(rule.created_at), 'MMM dd') : '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isLoading || !hasRuleId} aria-label={`Actions for rate limit rule ${rule.endpoint}`}>
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => hasRuleId && handleDelete(rule.id as string, rule.endpoint ?? 'this endpoint')}
                          disabled={isLoading || !hasRuleId}
                          className="text-destructive"
                        >
                          Delete Rule
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })
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
          <span className="sr-only">Applying rate limit changes</span>
        </div>
      ) : null}
    </div>
  )
}
