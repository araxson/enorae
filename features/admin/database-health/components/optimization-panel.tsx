'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
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
import { AlertCircle, Clock, Database } from 'lucide-react'
import type { OptimizationSnapshot } from '@/features/admin/database-health/api/queries/optimization'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

interface OptimizationPanelProps {
  data: OptimizationSnapshot
}

export function OptimizationPanel({ data }: OptimizationPanelProps) {
  const { recommendations, statisticsFreshness, unusedIndexes, summary } = data

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item className="w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between" variant="muted">
            <ItemContent className="space-y-1.5">
              <ItemTitle>Optimization Recommendations</ItemTitle>
              <ItemDescription>
                Review unused indexes and stale statistics to improve performance.
              </ItemDescription>
            </ItemContent>
            <ItemActions className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Badge variant="secondary" className="justify-start gap-1">
                <Database className="h-3 w-3" />
                {summary.unusedIndexCount} unused indexes
              </Badge>
              <Badge variant="secondary" className="justify-start gap-1">
                <Clock className="h-3 w-3" />
                {summary.staleStatistics} stale stats
              </Badge>
            </ItemActions>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="recommendations" className="w-full">
          <TabsList>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="indexes">Unused Indexes</TabsTrigger>
            <TabsTrigger value="statistics">Statistics Health</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-4">
            {recommendations.length > 0 ? (
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
                          {rec['status'] ?? 'low'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {rec['optimization'] ?? 'N/A'}
                      </TableCell>
                      <TableCell className="max-w-md">
                        {rec['recommendation'] ?? 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Empty>
                <EmptyMedia variant="icon">
                  <AlertCircle />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>No optimization recommendations</EmptyTitle>
                  <EmptyDescription>Your database is running optimally right now.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </TabsContent>

          <TabsContent value="indexes">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Schema</TableHead>
                  <TableHead>Index Name</TableHead>
                  <TableHead>Scans</TableHead>
                  <TableHead>Size</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unusedIndexes.slice(0, 30).map((idx, index) => (
                  <TableRow key={index}>
                    <TableCell>{String(idx['schemaname'] ?? 'N/A')}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {String(idx['index_name'] ?? 'N/A')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={(idx['scans'] ?? 0) === 0 ? 'destructive' : 'default'}>
                        {idx['scans']?.toLocaleString() ?? 0}
                      </Badge>
                    </TableCell>
                    <TableCell>{String(idx['index_size'] ?? 'N/A')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {unusedIndexes.length === 0 && (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No unused indexes detected</EmptyTitle>
                  <EmptyDescription>Every monitored index has recent scan activity.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </TabsContent>

          <TabsContent value="statistics">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Schema.Table</TableHead>
                  <TableHead>Live Rows</TableHead>
                  <TableHead>Last Analyze</TableHead>
                  <TableHead>Last Auto-analyze</TableHead>
                  <TableHead>Freshness</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statisticsFreshness.slice(0, 30).map((stat, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono text-xs">
                      {String(stat['schemaname'] ?? 'N/A')}.{String(stat['tablename'] ?? 'N/A')}
                    </TableCell>
                    <TableCell>{stat['live_rows']?.toLocaleString() ?? 0}</TableCell>
                    <TableCell className="text-xs">
                      {stat['last_analyze']
                        ? new Date(stat['last_analyze']).toLocaleDateString()
                        : 'Never'}
                    </TableCell>
                    <TableCell className="text-xs">
                      {stat['last_autoanalyze']
                        ? new Date(stat['last_autoanalyze']).toLocaleDateString()
                        : 'Never'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          stat['freshness'] === 'stale'
                            ? 'destructive'
                            : stat['freshness'] === 'aging'
                              ? 'secondary'
                              : 'default'
                        }
                      >
                        {stat['freshness'] ?? 'unknown'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {statisticsFreshness.length === 0 && (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No statistics data available</EmptyTitle>
                  <EmptyDescription>Statistics health appears once analyze jobs report freshness.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
