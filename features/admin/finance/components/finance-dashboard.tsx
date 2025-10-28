import { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RevenueOverview } from './revenue-overview'
import { RevenueBySalon } from './revenue-by-salon'
import { RevenueByChain } from './revenue-by-chain'
import { TransactionMonitoring } from './transaction-monitoring'
import { PaymentMethodStatsComponent } from './payment-method-stats'
import { Skeleton } from '@/components/ui/skeleton'
import {
  getPlatformRevenueAnalytics,
  getRevenueBySalon,
  getRevenueByChain,
  getTransactionMonitoring,
  getPaymentMethodStats,
} from '@/features/admin/finance/api/queries'

interface FinanceDashboardProps {
  startDate?: string
  endDate?: string
}

async function FinanceDashboardContent({ startDate, endDate }: FinanceDashboardProps) {
  const [
    revenueMetrics,
    revenueBySalon,
    revenueByChain,
    transactionMetrics,
    paymentMethodStats,
  ] = await Promise.all([
    getPlatformRevenueAnalytics(startDate, endDate),
    getRevenueBySalon(startDate, endDate, 20),
    getRevenueByChain(startDate, endDate),
    getTransactionMonitoring(100),
    getPaymentMethodStats(startDate, endDate),
  ])

  return (
    <div className="flex flex-col gap-10">
      <RevenueOverview metrics={revenueMetrics} />

      <Tabs defaultValue="by-salon">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="by-salon">By Salon</TabsTrigger>
          <TabsTrigger value="by-chain">By Chain</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="by-salon">
          <div className="mt-6">
            <RevenueBySalon data={revenueBySalon} />
          </div>
        </TabsContent>

        <TabsContent value="by-chain">
          <div className="mt-6">
            <RevenueByChain data={revenueByChain} />
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <div className="mt-6">
            <TransactionMonitoring metrics={transactionMetrics} />
          </div>
        </TabsContent>

        <TabsContent value="payment-methods">
          <div className="mt-6">
            <PaymentMethodStatsComponent stats={paymentMethodStats} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export type FinanceDashboardPropsWithSuspense = FinanceDashboardProps

export function FinanceDashboard(props: FinanceDashboardPropsWithSuspense) {
  return (
    <Suspense fallback={<FinanceDashboardSkeleton />}>
      {/* Suspense boundary ensures consistent loading UI for async data */}
      <FinanceDashboardContent {...props} />
    </Suspense>
  )
}

export function FinanceDashboardSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Skeleton key={index} className="h-32" />
        ))}
      </div>
      <Skeleton className="h-96" />
    </div>
  )
}
