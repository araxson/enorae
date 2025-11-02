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
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock, Database } from 'lucide-react'
import { RecommendationsTab } from './recommendations-tab'
import { IndexesTab } from './indexes-tab'
import { StatisticsTab } from './statistics-tab'
import type { OptimizationPanelProps } from './types'

/**
 * Database optimization panel
 *
 * Displays:
 * - Optimization recommendations by priority
 * - Unused indexes with scan counts
 * - Statistics freshness for tables
 */
export function OptimizationPanel({ data }: OptimizationPanelProps) {
  const { recommendations, statisticsFreshness, unusedIndexes, summary } = data

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item
            className="w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
            variant="muted"
          >
            <ItemContent className="space-y-1.5">
              <ItemTitle>Optimization Recommendations</ItemTitle>
              <ItemDescription>
                Review unused indexes and stale statistics to improve performance.
              </ItemDescription>
            </ItemContent>
            <ItemActions className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <div className="flex items-center gap-1">
                <Badge variant="secondary">
                  <Database className="mr-1 size-3" />
                  {summary.unusedIndexCount} unused indexes
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="secondary">
                  <Clock className="mr-1 size-3" />
                  {summary.staleStatistics} stale stats
                </Badge>
              </div>
            </ItemActions>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Tabs defaultValue="recommendations">
            <TabsList>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="indexes">Unused Indexes</TabsTrigger>
              <TabsTrigger value="statistics">Statistics Health</TabsTrigger>
            </TabsList>

            <TabsContent value="recommendations">
              <RecommendationsTab recommendations={recommendations} />
            </TabsContent>

            <TabsContent value="indexes">
              <IndexesTab indexes={unusedIndexes} />
            </TabsContent>

            <TabsContent value="statistics">
              <StatisticsTab statistics={statisticsFreshness} />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}
