import {
  getProductUsage,
  getUsageAnalytics,
  getUsageTrends,
  getServiceCostAnalysis,
  getHighUsageProducts,
} from './api/queries'
import { UsageList } from './components/usage-list'
import { UsageAnalyticsDashboard } from './components/usage-analytics-dashboard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export async function ProductUsage() {
  const [usage, analytics, trends, serviceCosts, highUsageProducts] = await Promise.all([
    getProductUsage(),
    getUsageAnalytics(),
    getUsageTrends(30),
    getServiceCostAnalysis(),
    getHighUsageProducts(30),
  ])

  return (
    <Tabs defaultValue="analytics" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="analytics">Analytics & Reports</TabsTrigger>
        <TabsTrigger value="history">Usage History</TabsTrigger>
      </TabsList>

      <TabsContent value="analytics" className="mt-6">
        <UsageAnalyticsDashboard
          analytics={analytics}
          trends={trends}
          serviceCosts={serviceCosts}
          highUsageProducts={highUsageProducts}
        />
      </TabsContent>

      <TabsContent value="history" className="mt-6">
        <UsageList usage={usage} />
      </TabsContent>
    </Tabs>
  )
}
