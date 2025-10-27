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
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

import {
  businessFeatures,
  customerFeatures,
} from './features.data'

export function Features() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader className="items-center justify-center">
          <CardTitle>Everything you need</CardTitle>
          <CardDescription>
            Powerful tools for both clients and salon teams
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <Tabs defaultValue="customers" className="w-full">
            <TabsList className="justify-center">
              <TabsTrigger value="customers">For customers</TabsTrigger>
              <TabsTrigger value="business">For salons</TabsTrigger>
            </TabsList>
            <TabsContent value="customers" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {customerFeatures.map(({ icon: Icon, title, description }) => (
                  <Item key={title} className="flex-col" variant="outline">
                    <ItemContent>
                      <ItemMedia variant="icon">
                        <Icon className="size-5 text-primary" />
                      </ItemMedia>
                      <ItemTitle>{title}</ItemTitle>
                      <ItemDescription>{description}</ItemDescription>
                    </ItemContent>
                  </Item>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="business" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {businessFeatures.map(({ icon: Icon, title, description }) => (
                  <Item key={title} className="flex-col" variant="outline">
                    <ItemContent>
                      <ItemMedia variant="icon">
                        <Icon className="size-5 text-primary" />
                      </ItemMedia>
                      <ItemTitle>{title}</ItemTitle>
                      <ItemDescription>{description}</ItemDescription>
                    </ItemContent>
                  </Item>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  )
}
