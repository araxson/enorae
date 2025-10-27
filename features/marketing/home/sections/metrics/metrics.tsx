import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ItemGroup } from '@/components/ui/item'
import { StatBadge } from '@/features/marketing/common-components'

import { metrics } from './metrics.data'

export function Metrics() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader className="items-center justify-center">
          <CardTitle>Trusted by beauty professionals</CardTitle>
          <CardDescription>
            Key platform metrics updated weekly
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((stat) => (
            <StatBadge key={stat.label} {...stat} />
          ))}
        </CardContent>
      </Card>
    </section>
  )
}
