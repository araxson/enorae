import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { getSessionSecurityMonitoring } from './api/queries'
import { SessionSecurityClient } from './components'

export async function SessionSecurityMonitoring() {
  const snapshot = await getSessionSecurityMonitoring({ limit: 100, offset: 0 })

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <ItemGroup className="mb-8 gap-2">
          <Item variant="muted" className="flex-col items-start gap-2">
            <ItemContent>
              <ItemTitle>Session Security Management</ItemTitle>
              <ItemDescription>
                Monitor session risk scores and enforce MFA requirements across the platform
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
        <SessionSecurityClient snapshot={snapshot} />
      </div>
    </section>
  )
}
