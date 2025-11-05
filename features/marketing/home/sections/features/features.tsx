import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { MarketingPanel, MarketingSection } from '@/features/marketing/components/common'

import {
  businessFeatures,
  customerFeatures,
} from './features.data'

export function Features() {
  return (
    <MarketingSection spacing="compact" groupClassName="gap-0">
      <MarketingPanel
        align="center"
        title="Everything you need"
        description="Powerful tools for both clients and salon teams"
      >
        <Tabs defaultValue="customers" className="w-full">
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="customers">For customers</TabsTrigger>
              <TabsTrigger value="business">For salons</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="customers">
            <div className="mt-6 flex flex-col gap-4">
              <ItemDescription>
                Built for clients booking beauty experiences in just a few taps.
              </ItemDescription>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {customerFeatures.map(({ icon: Icon, title, description }) => (
                  <Item key={title} variant="outline">
                    <ItemMedia variant="icon">
                      <Icon className="size-5" aria-hidden="true" />
                    </ItemMedia>
                    <ItemContent>
                      <div className="flex flex-col gap-1">
                        <ItemTitle>{title}</ItemTitle>
                        <ItemDescription>{description}</ItemDescription>
                      </div>
                    </ItemContent>
                  </Item>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="business">
            <div className="mt-6 flex flex-col gap-4">
              <ItemDescription>
                Everything owners need to manage schedules, teams, and growth.
              </ItemDescription>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {businessFeatures.map(({ icon: Icon, title, description }) => (
                  <Item key={title} variant="outline">
                    <ItemMedia variant="icon">
                      <Icon className="size-5" aria-hidden="true" />
                    </ItemMedia>
                    <ItemContent>
                      <div className="flex flex-col gap-1">
                        <ItemTitle>{title}</ItemTitle>
                        <ItemDescription>{description}</ItemDescription>
                      </div>
                    </ItemContent>
                  </Item>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </MarketingPanel>
    </MarketingSection>
  )
}
