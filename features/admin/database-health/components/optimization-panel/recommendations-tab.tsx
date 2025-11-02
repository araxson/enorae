'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { AlertCircle } from 'lucide-react'

/**
 * Recommendations tab content
 */
export function RecommendationsTab({
  recommendations,
}: {
  recommendations: Array<Record<string, unknown>>
}) {
  if (recommendations.length === 0) {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <AlertCircle />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>No optimization recommendations</EmptyTitle>
          <EmptyDescription>Your database is running optimally right now.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Priority</TableHead>
          <TableHead>Optimization</TableHead>
          <TableHead>Recommendation</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recommendations.map((rec, idx) => (
          <TableRow key={idx}>
            <TableCell>
              <Badge
                variant={
                  rec['status'] === 'critical'
                    ? 'destructive'
                    : rec['status'] === 'high'
                      ? 'secondary'
                      : 'default'
                }
              >
                {String(rec['status'] ?? 'low')}
              </Badge>
            </TableCell>
            <TableCell className="font-medium">{String(rec['optimization'] ?? 'N/A')}</TableCell>
            <TableCell className="max-w-md">{String(rec['recommendation'] ?? 'N/A')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
