import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChainAnalyticsTable, ChainComplianceTable, SalonChainsClient } from '.'
import type { getAllSalonChains, getChainAnalytics, getChainCompliance } from '../api/queries'

type AdminChainsContentProps = {
  chains: Awaited<ReturnType<typeof getAllSalonChains>>
  analytics: Awaited<ReturnType<typeof getChainAnalytics>>
  compliance: Awaited<ReturnType<typeof getChainCompliance>>
}

export function AdminChainsContent({ chains, analytics, compliance }: AdminChainsContentProps) {
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
