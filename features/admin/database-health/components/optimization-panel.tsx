'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
import type { OptimizationSnapshot } from '../api/internal/optimization'

interface OptimizationPanelProps {
  data: OptimizationSnapshot
}

export function OptimizationPanel({ data }: OptimizationPanelProps) {
  const { recommendations, statisticsFreshness, unusedIndexes, summary } = data

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1.5">
            <CardTitle>Optimization Recommendations</CardTitle>
            <CardDescription>
              Review unused indexes and stale statistics to improve performance.
            </CardDescription>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Badge variant="secondary" className="justify-start gap-1">
              <Database className="h-3 w-3" />
              {summary.unusedIndexCount} unused indexes
            </Badge>
            <Badge variant="secondary" className="justify-start gap-1">
              <Clock className="h-3 w-3" />
              {summary.staleStatistics} stale stats
            </Badge>
          </div>
        </div>
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
                            rec.status === 'critical'
                              ? 'destructive'
                              : rec.status === 'high'
                                ? 'secondary'
                                : 'default'
                          }
                        >
                          {rec.status ?? 'low'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {rec.optimization ?? 'N/A'}
                      </TableCell>
                      <TableCell className="max-w-md">
                        {rec.recommendation ?? 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
                <div className="font-semibold">No Optimization Recommendations</div>
                <p className="text-muted-foreground">Your database is running optimally!</p>
              </div>
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
                    <TableCell>{String(idx.schemaname ?? 'N/A')}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {String(idx.index_name ?? 'N/A')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={(idx.scans ?? 0) === 0 ? 'destructive' : 'default'}>
                        {idx.scans?.toLocaleString() ?? 0}
                      </Badge>
                    </TableCell>
                    <TableCell>{String(idx.index_size ?? 'N/A')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {unusedIndexes.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">All indexes are being used</p>
              </div>
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
                      {String(stat.schemaname ?? 'N/A')}.{String(stat.tablename ?? 'N/A')}
                    </TableCell>
                    <TableCell>{stat.live_rows?.toLocaleString() ?? 0}</TableCell>
                    <TableCell className="text-xs">
                      {stat.last_analyze
                        ? new Date(stat.last_analyze).toLocaleDateString()
                        : 'Never'}
                    </TableCell>
                    <TableCell className="text-xs">
                      {stat.last_autoanalyze
                        ? new Date(stat.last_autoanalyze).toLocaleDateString()
                        : 'Never'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          stat.freshness === 'stale'
                            ? 'destructive'
                            : stat.freshness === 'aging'
                              ? 'secondary'
                              : 'default'
                        }
                      >
                        {stat.freshness ?? 'unknown'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {statisticsFreshness.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No statistics data available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
