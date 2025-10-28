'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { QueryPerformanceSnapshot } from '@/features/admin/database-health/api/queries/query-performance'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Timer } from 'lucide-react'

interface QueryPerformancePanelProps {
  data: QueryPerformanceSnapshot
}

export function QueryPerformancePanel({ data }: QueryPerformancePanelProps) {
  const { mostCalledQueries, slowQueries, indexPerformance } = data

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item>
            <ItemMedia variant="icon">
              <Timer className="h-5 w-5" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Query Performance</ItemTitle>
              <ItemDescription>
                Investigate slow queries, frequency trends, and index efficiency.
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="slow" className="w-full">
          <TabsList>
            <TabsTrigger value="slow">Slow Queries</TabsTrigger>
            <TabsTrigger value="frequent">Most Called</TabsTrigger>
            <TabsTrigger value="indexes">Index Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="slow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Query</TableHead>
                  <TableHead>Calls</TableHead>
                  <TableHead>Avg Time (ms)</TableHead>
                  <TableHead>Max Time (ms)</TableHead>
                  <TableHead>Cache Hit %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slowQueries.slice(0, 20).map((query, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono text-xs max-w-md truncate">
                      {query['query_preview'] ?? 'N/A'}
                    </TableCell>
                    <TableCell>{query['calls']?.toLocaleString() ?? 0}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          (query['avg_time_ms'] ?? 0) > 100
                            ? 'destructive'
                            : (query['avg_time_ms'] ?? 0) > 50
                              ? 'secondary'
                              : 'default'
                        }
                      >
                        {query['avg_time_ms']?.toFixed(2) ?? 0}
                      </Badge>
                    </TableCell>
                    <TableCell>{query['max_time_ms']?.toFixed(2) ?? 0}</TableCell>
                    <TableCell>
                      {query['cache_hit_ratio']?.toFixed(1) ?? 0}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {slowQueries.length === 0 && (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No slow queries detected</EmptyTitle>
                  <EmptyDescription>All monitored queries fall within the configured performance thresholds.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </TabsContent>

          <TabsContent value="frequent">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Query</TableHead>
                  <TableHead>Total Calls</TableHead>
                  <TableHead>Avg Time (ms)</TableHead>
                  <TableHead>Avg Rows</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mostCalledQueries.slice(0, 20).map((query, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono text-xs max-w-md truncate">
                      {query['query_preview'] ?? 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge>{query['calls']?.toLocaleString() ?? 0}</Badge>
                    </TableCell>
                    <TableCell>{query['avg_time_ms']?.toFixed(2) ?? 0}</TableCell>
                    <TableCell>
                      {query['avg_rows_per_call']?.toFixed(0) ?? 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {mostCalledQueries.length === 0 && (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No query data available</EmptyTitle>
                  <EmptyDescription>Query frequency analytics populate after sampling recent traffic.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </TabsContent>

          <TabsContent value="indexes">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Index</TableHead>
                  <TableHead>Scans</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Avg Tuples/Scan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {indexPerformance.slice(0, 20).map((idx, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-xs">
                      {String(idx['index_name'] ?? 'N/A')}
                    </TableCell>
                    <TableCell>
                      {idx['index_scans']?.toLocaleString() ?? 0}
                    </TableCell>
                    <TableCell>{String(idx['index_size'] ?? 'N/A')}</TableCell>
                    <TableCell>
                      {idx['avg_tuples_per_scan']?.toFixed(0) ?? 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {indexPerformance.length === 0 && (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No index data available</EmptyTitle>
                  <EmptyDescription>Index efficiency metrics appear when scans and usage statistics are present.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
