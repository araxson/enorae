import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { AlertTriangle, Database } from 'lucide-react'
import { getStatisticsFreshness } from '../api/queries'
import { FreshnessTable } from './freshness-table'

export async function StatsFreshnessMonitor() {
  const snapshot = await getStatisticsFreshness({ limit: 100, offset: 0 })

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <ItemGroup className="mb-8 gap-2">
          <Item variant="muted" className="flex-col items-start gap-2">
            <ItemContent>
              <ItemTitle>Stats Freshness Monitor</ItemTitle>
              <ItemDescription>
                Monitor table statistics freshness and trigger maintenance
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>

        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <ItemGroup>
                <Item>
                  <ItemMedia variant="icon">
                    <Database className="h-5 w-5" aria-hidden="true" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Total Tables</ItemTitle>
                  </ItemContent>
                </Item>
              </ItemGroup>
            </CardHeader>
            <CardContent>
              <ItemGroup>
                <Item className="flex-col items-start gap-1">
                  <ItemContent>
                    <CardTitle>{snapshot.totalCount}</CardTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>Total monitored tables</ItemDescription>
                  </ItemContent>
                </Item>
              </ItemGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <ItemGroup>
                <Item>
                  <ItemMedia variant="icon">
                    <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Stale Statistics</ItemTitle>
                  </ItemContent>
                </Item>
              </ItemGroup>
            </CardHeader>
            <CardContent>
              <ItemGroup>
                <Item className="flex-col items-start gap-1">
                  <ItemContent>
                    <CardTitle>{snapshot.staleCount}</CardTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>Maintenance needed</ItemDescription>
                  </ItemContent>
                </Item>
              </ItemGroup>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <ItemGroup>
              <Item>
                <ItemContent>
                  <ItemTitle>Table Statistics</ItemTitle>
                  <ItemDescription>
                    Last analyze timestamp and maintenance recommendations
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <FreshnessTable tables={snapshot.tables} />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
