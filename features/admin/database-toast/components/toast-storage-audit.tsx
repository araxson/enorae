import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { AlertTriangle, Database, Layers, Package } from 'lucide-react'
import { getToastUsage } from '../api/queries'
import { ToastUsageTable } from './toast-usage-table'

export async function ToastStorageAudit() {
  const snapshot = await getToastUsage({ limit: 100, offset: 0 })

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <ItemGroup className="mb-8 gap-2">
          <Item variant="muted" className="flex-col items-start gap-2">
            <ItemContent>
              <ItemTitle>TOAST Storage Audit</ItemTitle>
              <ItemDescription>
                Analyze TOAST usage and identify optimization opportunities
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
                <Item className="flex-col items-start gap-2">
                  <ItemContent>
                    <CardTitle>{snapshot.totalCount}</CardTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>Tables analyzed</ItemDescription>
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
                    <ItemTitle>High TOAST Usage</ItemTitle>
                  </ItemContent>
                </Item>
              </ItemGroup>
            </CardHeader>
            <CardContent>
              <ItemGroup>
                <Item className="flex-col items-start gap-2">
                  <ItemContent>
                    <CardTitle>{snapshot.highToastCount}</CardTitle>
                  </ItemContent>
                  <ItemActions>
                    <Badge variant="destructive">High usage</Badge>
                  </ItemActions>
                  <ItemContent>
                    <ItemDescription>&gt; 20% bloat</ItemDescription>
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
                    <Package className="h-5 w-5" aria-hidden="true" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Total TOAST</ItemTitle>
                  </ItemContent>
                </Item>
              </ItemGroup>
            </CardHeader>
            <CardContent>
              <ItemGroup>
                <Item className="flex-col items-start gap-2">
                  <ItemContent>
                    <CardTitle>{formatBytes(snapshot.totalToastBytes)}</CardTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>Total compressed storage</ItemDescription>
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
                  <Layers className="h-5 w-5" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>TOAST Usage Summary</ItemTitle>
                  <ItemDescription>
                    Table bloat and compression recommendations
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <ToastUsageTable tables={snapshot.tables} />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
