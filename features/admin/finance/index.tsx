import { Suspense } from 'react'
import { Stack } from '@/components/layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RevenueOverview } from './components/revenue-overview'
import { RevenueBySalon } from './components/revenue-by-salon'
import { RevenueByChain } from './components/revenue-by-chain'
import { TransactionMonitoring } from './components/transaction-monitoring'
import { PaymentMethodStatsComponent } from './components/payment-method-stats'
import { ExportFinancialData } from './components/export-financial-data'
import { Skeleton } from '@/components/ui/skeleton'
import {
  getPlatformRevenueAnalytics,
  getRevenueBySalon,
  getRevenueByChain,
  getTransactionMonitoring,
  getPaymentMethodStats
} from './api/queries'

interface FinanceDashboardProps {
  startDate?: string
  endDate?: string
}

export async function FinanceDashboard({ startDate, endDate }: FinanceDashboardProps) {
  const [
    revenueMetrics,
    revenueBySalon,
    revenueByChain,
    transactionMetrics,
    paymentMethodStats
  ] = await Promise.all([
    getPlatformRevenueAnalytics(startDate, endDate),
    getRevenueBySalon(startDate, endDate, 20),
    getRevenueByChain(startDate, endDate),
    getTransactionMonitoring(100),
    getPaymentMethodStats(startDate, endDate)
  ])

  return (
    <Stack gap="xl">
      <RevenueOverview metrics={revenueMetrics} />

      <Tabs defaultValue="by-salon" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="by-salon">By Salon</TabsTrigger>
          <TabsTrigger value="by-chain">By Chain</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="by-salon" className="mt-6">
          <RevenueBySalon data={revenueBySalon} />
        </TabsContent>

        <TabsContent value="by-chain" className="mt-6">
          <RevenueByChain data={revenueByChain} />
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <TransactionMonitoring metrics={transactionMetrics} />
        </TabsContent>

        <TabsContent value="payment-methods" className="mt-6">
          <PaymentMethodStatsComponent stats={paymentMethodStats} />
        </TabsContent>
      </Tabs>

      <ExportFinancialData />
    </Stack>
  )
}

export function FinanceDashboardSkeleton() {
  return (
    <Stack gap="xl">
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <Skeleton className="h-96" />
    </Stack>
  )
}
