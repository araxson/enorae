'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Item, ItemActions, ItemContent, ItemGroup } from '@/components/ui/item'

interface NotificationTogglesProps {
  marketingEmails: boolean
  smsAlerts: boolean
  isPending: boolean
  onMarketingEmailsChange: (value: boolean) => void
  onSmsAlertsChange: (value: boolean) => void
}

/**
 * Notification preferences toggles
 */
export function NotificationToggles({
  marketingEmails,
  smsAlerts,
  isPending,
  onMarketingEmailsChange,
  onSmsAlertsChange,
}: NotificationTogglesProps) {
  return (
    <div className="flex flex-col gap-3">
      <Card>
        <CardHeader>
          <div className="pb-2">
            <ItemGroup>
              <Item variant="muted">
                <ItemContent>
                  <CardTitle>Marketing emails</CardTitle>
                  <CardDescription>Send product updates and promotional campaigns.</CardDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </div>
        </CardHeader>
        <CardContent>
          <div className="pt-0">
            <ItemGroup className="items-center justify-between gap-4">
              <Item variant="muted">
                <ItemActions>
                  <Switch
                    checked={marketingEmails}
                    onCheckedChange={onMarketingEmailsChange}
                    disabled={isPending}
                    aria-label="Toggle marketing emails"
                  />
                </ItemActions>
              </Item>
            </ItemGroup>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="pb-2">
            <ItemGroup>
              <Item variant="muted">
                <ItemContent>
                  <CardTitle>SMS alerts</CardTitle>
                  <CardDescription>Enable SMS notifications where available.</CardDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </div>
        </CardHeader>
        <CardContent>
          <div className="pt-0">
            <ItemGroup className="items-center justify-between gap-4">
              <Item variant="muted">
                <ItemActions>
                  <Switch
                    checked={smsAlerts}
                    onCheckedChange={onSmsAlertsChange}
                    disabled={isPending}
                    aria-label="Toggle SMS alerts"
                  />
                </ItemActions>
              </Item>
            </ItemGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
