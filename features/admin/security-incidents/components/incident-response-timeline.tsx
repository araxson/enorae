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
import { AlertTriangle, ShieldAlert, Timer } from 'lucide-react'
import { getSecurityIncidents } from '../api/queries'
import { IncidentTimeline } from './incident-timeline'

export async function IncidentResponseTimeline() {
  const snapshot = await getSecurityIncidents({ limit: 100, offset: 0 })

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <ItemGroup className="mb-8 gap-2">
          <Item variant="muted" className="flex-col items-start gap-2">
            <ItemContent>
              <ItemTitle>Incident Response Timeline</ItemTitle>
              <ItemDescription>
                Track security incidents and manage remediation status
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
                    <ShieldAlert className="h-5 w-5" aria-hidden="true" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Total Incidents</ItemTitle>
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
                    <ItemDescription>All recorded incidents</ItemDescription>
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
                    <ItemTitle>Critical</ItemTitle>
                  </ItemContent>
                </Item>
              </ItemGroup>
            </CardHeader>
          <CardContent>
            <ItemGroup>
              <Item className="flex-col items-start gap-2">
                <ItemContent>
                  <CardTitle>{snapshot.criticalCount}</CardTitle>
                </ItemContent>
                <ItemActions>
                  <Badge variant="destructive">Critical</Badge>
                </ItemActions>
                <ItemContent>
                  <ItemDescription>Highest priority cases</ItemDescription>
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
                    <Timer className="h-5 w-5" aria-hidden="true" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Pending</ItemTitle>
                  </ItemContent>
                </Item>
              </ItemGroup>
            </CardHeader>
          <CardContent>
            <ItemGroup>
              <Item className="flex-col items-start gap-2">
                <ItemContent>
                  <CardTitle>{snapshot.pendingCount}</CardTitle>
                </ItemContent>
                <ItemActions>
                  <Badge variant="secondary">Pending</Badge>
                </ItemActions>
                <ItemContent>
                  <ItemDescription>Awaiting resolution</ItemDescription>
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
                  <ItemTitle>Incident Log</ItemTitle>
                  <ItemDescription>
                    Recent security incidents and their remediation status
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <IncidentTimeline incidents={snapshot.incidents} />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
