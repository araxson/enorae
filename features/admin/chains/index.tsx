import { Suspense } from 'react'
import { Section, Stack } from '@/components/layout'
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
    <Section size="lg">
      <Stack gap="xl">
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
      </Stack>
    </Section>
  )
}

export function AdminChainsSkeleton() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </Stack>
    </Section>
  )
}
