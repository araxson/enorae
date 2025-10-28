import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
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
      <Card>
        <CardHeader>
          <div className="flex flex-col items-center text-center">
            <CardTitle>Everything you need</CardTitle>
            <CardDescription>
              Powerful tools for both clients and salon teams
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </MarketingSection>
  )
}
