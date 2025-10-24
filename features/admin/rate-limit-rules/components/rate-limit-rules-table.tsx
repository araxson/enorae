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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { MoreHorizontal } from 'lucide-react'
import type { RateLimitRule } from '@/features/admin/rate-limit-rules/api/queries'
import { toggleRateLimitRule, deleteRateLimitRule } from '@/features/admin/rate-limit-rules/api/mutations'

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
      formData.append('active', (!currentActive).toString())
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

  const formatWindowSeconds = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`
    return `${Math.round(seconds / 3600)}h`
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Endpoint</TableHead>
            <TableHead>Limit</TableHead>
            <TableHead>Time Window</TableHead>
            <TableHead>Violations Today</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No rate limit rules defined
              </TableCell>
            </TableRow>
          ) : (
            rules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell className="font-mono text-sm">{rule.endpoint}</TableCell>
                <TableCell className="font-semibold">{rule.limit_threshold}</TableCell>
                <TableCell>{formatWindowSeconds(rule.window_seconds)}</TableCell>
                <TableCell className="font-semibold">{rule.recent_violations}</TableCell>
                <TableCell>
                  <Switch
                    checked={rule.active}
                    onCheckedChange={() => handleToggle(rule.id, rule.active)}
                    disabled={isLoading}
                  />
                </TableCell>
                <TableCell className="text-sm">
                  {format(new Date(rule.created_at), 'MMM dd')}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isLoading}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleDelete(rule.id, rule.endpoint)}
                        disabled={isLoading}
                        className="text-destructive"
                      >
                        Delete Rule
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
