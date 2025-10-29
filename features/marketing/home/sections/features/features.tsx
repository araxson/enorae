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
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { MarketingSection } from '@/features/marketing/common-components'

import {
  businessFeatures,
  customerFeatures,
} from './features.data'

export function Features() {
  return (
    <MarketingSection spacing="compact" groupClassName="gap-0">
      <Item variant="outline" className="flex flex-col gap-6">
        <ItemHeader className="flex flex-col items-center text-center">
          <ItemTitle>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Everything you need
            </h2>
          </ItemTitle>
          <p className="text-muted-foreground text-base md:text-lg">
            Powerful tools for both clients and salon teams
          </p>
        </ItemHeader>
        <ItemContent>
          <div className="flex flex-col gap-6">
            <Tabs defaultValue="customers" className="w-full">
              <div className="flex justify-center">
                <TabsList>
                  <TabsTrigger value="customers">For customers</TabsTrigger>
                  <TabsTrigger value="business">For salons</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="customers">
                <div className="mt-6 flex flex-col gap-4">
                  <Item variant="muted">
                    <ItemContent>
                      <ItemDescription>Built for clients booking beauty experiences in just a few taps.</ItemDescription>
                    </ItemContent>
                  </Item>
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
                  <Item variant="muted">
                    <ItemContent>
                      <ItemDescription>Everything owners need to manage schedules, teams, and growth.</ItemDescription>
                    </ItemContent>
                  </Item>
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
          </div>
        </ItemContent>
      </Item>
    </MarketingSection>
  )
}
