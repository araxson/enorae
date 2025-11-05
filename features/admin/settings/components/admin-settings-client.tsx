'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Settings, Shield, Mail, Bell, Database, Info } from 'lucide-react'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { AdminSection } from '@/features/admin/common/components'

interface SettingSection {
  id: string
  icon: typeof Shield
  title: string
  description: string
  features: string[]
  available: boolean
}

export function AdminSettingsClient() {
  const sections: SettingSection[] = [
    {
      id: 'security',
      icon: Shield,
      title: 'Security Settings',
      description: 'Manage authentication, authorization, and security policies',
      features: [
        'Password policies',
        'Two-factor authentication',
        'Session management',
        'Rate limiting configuration'
      ],
      available: false
    },
    {
      id: 'email',
      icon: Mail,
      title: 'Email Configuration',
      description: 'Configure SMTP settings and email templates',
      features: [
        'SMTP provider settings',
        'Email templates',
        'Notification preferences',
        'Delivery monitoring'
      ],
      available: false
    },
    {
      id: 'notifications',
      icon: Bell,
      title: 'Notification Settings',
      description: 'Manage platform notifications and alerts',
      features: [
        'Admin notifications',
        'System alerts',
        'Error notifications',
        'Webhook configurations'
      ],
      available: false
    },
    {
      id: 'database',
      icon: Database,
      title: 'Database Settings',
      description: 'Database optimization and maintenance',
      features: [
        'Connection pooling',
        'Query optimization',
        'Backup configuration',
        'Index management'
      ],
      available: false
    },
    {
      id: 'general',
      icon: Settings,
      title: 'General Settings',
      description: 'Platform-wide configuration options',
      features: [
        'Platform name and branding',
        'Default locale and timezone',
        'Feature flags',
        'Maintenance mode'
      ],
      available: false
    }
  ]

  return (
    <AdminSection>
      <div className="flex flex-col gap-10">
        <Alert>
          <Info className="size-4" />
          <AlertTitle>Configuration Status</AlertTitle>
          <AlertDescription>
            Settings functionality will be implemented in a future update.
            Platform configuration is currently managed through environment variables and Supabase Dashboard.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <div key={section.id} className="relative">
                <Card>
                    <CardHeader>
                      <ItemGroup>
                        <Item variant="muted">
                          <ItemContent>
                            <div className="flex items-center gap-2">
                              <ItemMedia variant="icon">
                                <Icon className="size-5 text-primary" aria-hidden="true" />
                              </ItemMedia>
                              <ItemTitle>{section.title}</ItemTitle>
                            </div>
                          </ItemContent>
                          {!section.available ? (
                            <ItemActions>
                              <Badge variant="secondary">Coming Soon</Badge>
                            </ItemActions>
                          ) : null}
                        </Item>
                        <Item variant="muted">
                          <ItemContent>
                            <ItemDescription>{section.description}</ItemDescription>
                          </ItemContent>
                        </Item>
                      </ItemGroup>
                    </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <ul className="space-y-2">
                        {section.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="size-1.5 rounded-full bg-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Separator />
                      <ButtonGroup aria-label="Section actions">
                        <div className="w-full">
                          {section.available ? (
                            <Button variant="outline" size="sm">
                              Configure
                            </Button>
                          ) : (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="outline" size="sm" disabled>
                                  Configure
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Feature coming soon</TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </ButtonGroup>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </AdminSection>
  )
}
