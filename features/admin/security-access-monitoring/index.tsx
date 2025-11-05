import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { getSecurityAccessMonitoring } from './api/queries'
import { SecurityAccessClient } from './components'

export async function SecurityAccessMonitoring(): Promise<React.JSX.Element> {
  const snapshot = await getSecurityAccessMonitoring({ limit: 100, offset: 0 })

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <ItemGroup className="mb-8 gap-2">
          <Item variant="muted" className="flex-col items-start gap-2">
            <ItemContent>
              <ItemTitle>Security Operations Center</ItemTitle>
              <ItemDescription>
                Monitor and manage access attempts and security events across the platform
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
        <SecurityAccessClient snapshot={snapshot} />
      </div>
    </section>
  )
}
export type * from './api/types'
