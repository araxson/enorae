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
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <Alert>
            <Info className="h-4 w-4" />
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
                <Card key={section.id} className="relative">
                  <CardHeader>
                    <ItemGroup>
                      <Item className="items-start justify-between gap-2">
                        <ItemContent className="flex items-center gap-2">
                          <ItemMedia variant="icon">
                            <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                          </ItemMedia>
                          <ItemTitle>{section.title}</ItemTitle>
                        </ItemContent>
                        {!section.available && (
                          <ItemActions>
                            <Badge variant="secondary">Coming Soon</Badge>
                          </ItemActions>
                        )}
                      </Item>
                      <Item className="flex-col items-start gap-1">
                        <ItemContent>
                          <ItemDescription>{section.description}</ItemDescription>
                        </ItemContent>
                      </Item>
                    </ItemGroup>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ul className="space-y-2">
                      {section.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Separator />
                    <ButtonGroup className="w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!section.available}
                        className="w-full"
                      >
                        Configure
                      </Button>
                    </ButtonGroup>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
