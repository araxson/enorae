import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChainAnalyticsTable } from './chain-analytics'
import { ChainComplianceTable } from './chain-compliance'
import { SalonChainsClient } from './salon-chains-client'
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
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="mt-6">
                <SalonChainsClient chains={chains} />
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="mt-6">
                <ChainAnalyticsTable analytics={analytics} />
              </div>
            </TabsContent>

            <TabsContent value="compliance">
              <div className="mt-6">
                <ChainComplianceTable compliance={compliance} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
