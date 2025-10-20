import { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { getAllSalonChains, getChainAnalytics, getChainCompliance } from './api/queries'
import { ChainAnalyticsTable } from './components/chain-analytics'
import { ChainComplianceTable } from './components/chain-compliance'
import { SalonChainsClient } from './components/salon-chains-client'

export async function AdminChains() {
  const [chains, analytics, compliance] = await Promise.all([
    getAllSalonChains(),
    getChainAnalytics(),
    getChainCompliance()
  ])

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <SalonChainsClient chains={chains} />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <ChainAnalyticsTable analytics={analytics} />
          </TabsContent>

            <TabsContent value="compliance" className="mt-6">
              <ChainComplianceTable compliance={compliance} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}

export function AdminChainsSkeleton() {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <Skeleton className="h-10 w-full" />
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
