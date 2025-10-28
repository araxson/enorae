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
import type { DatabaseHealthSnapshot } from '@/features/admin/database-health/api/queries/database-health'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Database } from 'lucide-react'

interface DatabaseHealthPanelProps {
  data: DatabaseHealthSnapshot
}

export function DatabaseHealthPanel({ data }: DatabaseHealthPanelProps) {
  const { bloatedTables, cachePerformance, hotUpdateStats, toastUsage } = data

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item>
            <ItemMedia variant="icon">
              <Database className="size-5" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Database Health</ItemTitle>
              <ItemDescription>Monitor bloat, cache performance, HOT updates, and TOAST usage.</ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Tabs defaultValue="bloat">
          <TabsList>
            <TabsTrigger value="bloat">Table Bloat</TabsTrigger>
            <TabsTrigger value="cache">Cache Performance</TabsTrigger>
            <TabsTrigger value="hot-updates">HOT Updates</TabsTrigger>
            <TabsTrigger value="toast">TOAST Usage</TabsTrigger>
          </TabsList>

          <TabsContent value="bloat">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Schema.Table</TableHead>
                  <TableHead>Dead Tuples</TableHead>
                  <TableHead>Dead %</TableHead>
                  <TableHead>Last Analyze</TableHead>
                  <TableHead>Total Size</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bloatedTables.slice(0, 20).map((table, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono text-xs">
                      {String(table['schemaname'] ?? 'N/A')}.{String(table['tablename'] ?? 'N/A')}
                    </TableCell>
                    <TableCell>{table['dead_tuples']?.toLocaleString() ?? 0}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          (table['dead_tuple_percent'] ?? 0) > 20
                            ? 'destructive'
                            : (table['dead_tuple_percent'] ?? 0) > 10
                              ? 'secondary'
                              : 'default'
                        }
                      >
                        {table['dead_tuple_percent']?.toFixed(1) ?? 0}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {table['last_analyze']
                        ? new Date(table['last_analyze']).toLocaleDateString()
                        : 'Never'}
                    </TableCell>
                    <TableCell>{String(table['total_size'] ?? 'N/A')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {bloatedTables.length === 0 && (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No table bloat detected</EmptyTitle>
                  <EmptyDescription>Tables remain within healthy vacuum thresholds.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </TabsContent>

          <TabsContent value="cache">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Schema.Table</TableHead>
                  <TableHead>Cache Hit Ratio</TableHead>
                  <TableHead>Cache Hits</TableHead>
                  <TableHead>Disk Reads</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cachePerformance.slice(0, 20).map((table, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono text-xs">
                      {String(table['schemaname'] ?? 'N/A')}.{String(table['tablename'] ?? 'N/A')}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          (table['cache_hit_ratio'] ?? 100) < 80
                            ? 'destructive'
                            : (table['cache_hit_ratio'] ?? 100) < 90
                              ? 'secondary'
                              : 'default'
                        }
                      >
                        {table['cache_hit_ratio']?.toFixed(1) ?? 0}%
                      </Badge>
                    </TableCell>
                    <TableCell>{table['cache_hits']?.toLocaleString() ?? 0}</TableCell>
                    <TableCell>{table['disk_reads']?.toLocaleString() ?? 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {cachePerformance.length === 0 && (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No cache data available</EmptyTitle>
                  <EmptyDescription>Once cache hit metrics arrive, they will populate here.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </TabsContent>

          <TabsContent value="hot-updates">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Schema.Table</TableHead>
                  <TableHead>HOT Updates</TableHead>
                  <TableHead>HOT %</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hotUpdateStats.slice(0, 20).map((stat, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono text-xs">
                      {String(stat['schemaname'] ?? 'N/A')}.{String(stat['tablename'] ?? 'N/A')}
                    </TableCell>
                    <TableCell>{stat['hot_updates']?.toLocaleString() ?? 0}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          (stat['hot_update_percentage'] ?? 100) < 50
                            ? 'destructive'
                            : (stat['hot_update_percentage'] ?? 100) < 75
                              ? 'secondary'
                              : 'default'
                        }
                      >
                        {stat['hot_update_percentage']?.toFixed(1) ?? 0}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          stat['status'] === 'critical'
                            ? 'destructive'
                            : stat['status'] === 'warning'
                              ? 'secondary'
                              : 'default'
                        }
                      >
                        {stat['status'] ?? 'ok'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {hotUpdateStats.length === 0 && (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No HOT update data available</EmptyTitle>
                  <EmptyDescription>HOT update telemetry appears once write volume meets monitoring thresholds.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </TabsContent>

          <TabsContent value="toast">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Schema.Table</TableHead>
                  <TableHead>Main Size</TableHead>
                  <TableHead>TOAST + Index</TableHead>
                  <TableHead>TOAST Index %</TableHead>
                  <TableHead>Total Size</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {toastUsage.slice(0, 20).map((usage, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono text-xs">
                      {String(usage['schemaname'] ?? 'N/A')}.{String(usage['tablename'] ?? 'N/A')}
                    </TableCell>
                    <TableCell>{String(usage['main_size'] ?? 'N/A')}</TableCell>
                    <TableCell>{String(usage['toast_and_index_size'] ?? 'N/A')}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          (usage['toast_index_percentage'] ?? 0) > 50
                            ? 'secondary'
                            : 'default'
                        }
                      >
                        {usage['toast_index_percentage']?.toFixed(1) ?? 0}%
                      </Badge>
                    </TableCell>
                    <TableCell>{String(usage['total_size'] ?? 'N/A')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {toastUsage.length === 0 && (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No TOAST usage data available</EmptyTitle>
                  <EmptyDescription>Large object storage metrics will surface when TOAST usage is observed.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}
