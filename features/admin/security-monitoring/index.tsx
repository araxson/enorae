import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { getSecurityMonitoringSnapshot } from './api/queries'
import { SecurityDashboard } from './components'

export async function SecurityMonitoring() {
  const snapshot = await getSecurityMonitoringSnapshot()

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-10">
        <ItemGroup className="gap-2">
          <Item variant="muted" className="flex-col items-start gap-2">
            <ItemContent>
              <ItemTitle>Security Monitoring</ItemTitle>
              <ItemDescription>
                Monitor access attempts, detect anomalies, and manage security configurations
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>

        <SecurityDashboard snapshot={snapshot} />
      </div>
    </div>
  )
}
export * from './types'
