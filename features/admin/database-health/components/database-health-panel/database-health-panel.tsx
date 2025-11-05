'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { DatabaseHealthSnapshot } from '../../api/queries'
import { BloatTab } from './bloat-tab'
import { CacheTab } from './cache-tab'
import { HotUpdatesTab } from './hot-updates-tab'
import { ToastTab } from './toast-tab'

type DatabaseHealthPanelProps = {
  data: DatabaseHealthSnapshot
}

export function DatabaseHealthPanel({ data }: DatabaseHealthPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Health Monitoring</CardTitle>
        <CardDescription>
          Monitor table bloat, cache performance, hot updates, and TOAST usage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bloat" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bloat">
              Bloat <span className="ml-1 text-xs">({data.summary.totalBloatedTables})</span>
            </TabsTrigger>
            <TabsTrigger value="cache">
              Cache <span className="ml-1 text-xs">({data.summary.lowCacheHitTables})</span>
            </TabsTrigger>
            <TabsTrigger value="hot-updates">
              Hot Updates <span className="ml-1 text-xs">({data.summary.hotUpdateIssues})</span>
            </TabsTrigger>
            <TabsTrigger value="toast">TOAST</TabsTrigger>
          </TabsList>

          <TabsContent value="bloat" className="mt-4">
            <BloatTab bloatedTables={data.bloatedTables} />
          </TabsContent>

          <TabsContent value="cache" className="mt-4">
            <CacheTab cachePerformance={data.cachePerformance} />
          </TabsContent>

          <TabsContent value="hot-updates" className="mt-4">
            <HotUpdatesTab hotUpdateStats={data.hotUpdateStats} />
          </TabsContent>

          <TabsContent value="toast" className="mt-4">
            <ToastTab toastUsage={data.toastUsage} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
