import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { AlertTriangle, BarChart3, Clock, Timer } from 'lucide-react'
import { getQueryPerformance } from '../api/queries'
import { QueryPerformanceTable } from './query-performance-table'

export async function PerformanceDiagnostics() {
  const snapshot = await getQueryPerformance({ limit: 50, offset: 0 })

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <ItemGroup className="mb-8 gap-2">
          <Item variant="muted" className="flex-col items-start gap-2">
            <ItemContent>
              <ItemTitle>Performance Diagnostics</ItemTitle>
              <ItemDescription>
                Monitor query performance and identify optimization opportunities
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <ItemGroup>
                <Item>
                  <ItemMedia variant="icon">
                    <BarChart3 className="h-5 w-5" aria-hidden="true" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Total Queries</ItemTitle>
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
                    <ItemDescription>Queries analyzed</ItemDescription>
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
                    <ItemTitle>Slow Queries</ItemTitle>
                  </ItemContent>
                </Item>
              </ItemGroup>
            </CardHeader>
            <CardContent>
              <ItemGroup>
                <Item className="flex-col items-start gap-1">
                  <ItemContent>
                    <CardTitle>{snapshot.slowQueryCount}</CardTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>&gt; 100ms</ItemDescription>
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
                    <Clock className="h-5 w-5" aria-hidden="true" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Avg Mean Time</ItemTitle>
                  </ItemContent>
                </Item>
              </ItemGroup>
            </CardHeader>
            <CardContent>
              <ItemGroup>
                <Item className="flex-col items-start gap-1">
                  <ItemContent>
                    <CardTitle>{snapshot.avgMeanTime}ms</CardTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>Average execution time</ItemDescription>
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
                <ItemMedia variant="icon">
                  <Timer className="h-5 w-5" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Query Performance Summary</ItemTitle>
                  <ItemDescription>
                    Analyze query execution times and recommended indexes
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <QueryPerformanceTable queries={snapshot.queries} />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
