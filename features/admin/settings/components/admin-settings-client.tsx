import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Section, Stack, Grid } from '@/components/layout'
import { Small } from '@/components/ui/typography'
import { Settings, Shield, Mail, Bell, Database } from 'lucide-react'

export function AdminSettingsClient() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <Grid cols={{ base: 1, md: 2 }} gap="lg">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Security Settings</CardTitle>
              </div>
              <CardDescription>
                Manage authentication, authorization, and security policies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Stack gap="sm">
                <Small className="text-muted-foreground">
                  • Password policies
                </Small>
                <Small className="text-muted-foreground">
                  • Two-factor authentication
                </Small>
                <Small className="text-muted-foreground">
                  • Session management
                </Small>
                <Small className="text-muted-foreground">
                  • Rate limiting configuration
                </Small>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <CardTitle>Email Configuration</CardTitle>
              </div>
              <CardDescription>
                Configure SMTP settings and email templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Stack gap="sm">
                <Small className="text-muted-foreground">
                  • SMTP provider settings
                </Small>
                <Small className="text-muted-foreground">
                  • Email templates
                </Small>
                <Small className="text-muted-foreground">
                  • Notification preferences
                </Small>
                <Small className="text-muted-foreground">
                  • Delivery monitoring
                </Small>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>Notification Settings</CardTitle>
              </div>
              <CardDescription>
                Manage platform notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Stack gap="sm">
                <Small className="text-muted-foreground">
                  • Admin notifications
                </Small>
                <Small className="text-muted-foreground">
                  • System alerts
                </Small>
                <Small className="text-muted-foreground">
                  • Error notifications
                </Small>
                <Small className="text-muted-foreground">
                  • Webhook configurations
                </Small>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                <CardTitle>Database Settings</CardTitle>
              </div>
              <CardDescription>
                Database optimization and maintenance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Stack gap="sm">
                <Small className="text-muted-foreground">
                  • Connection pooling
                </Small>
                <Small className="text-muted-foreground">
                  • Query optimization
                </Small>
                <Small className="text-muted-foreground">
                  • Backup configuration
                </Small>
                <Small className="text-muted-foreground">
                  • Index management
                </Small>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <CardTitle>General Settings</CardTitle>
              </div>
              <CardDescription>
                Platform-wide configuration options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Stack gap="sm">
                <Small className="text-muted-foreground">
                  • Platform name and branding
                </Small>
                <Small className="text-muted-foreground">
                  • Default locale and timezone
                </Small>
                <Small className="text-muted-foreground">
                  • Feature flags
                </Small>
                <Small className="text-muted-foreground">
                  • Maintenance mode
                </Small>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Card>
          <CardHeader>
            <CardTitle>Configuration Status</CardTitle>
            <CardDescription>
              This is a placeholder page. Settings functionality will be implemented in a future update.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Small className="text-muted-foreground">
              For now, platform configuration is managed through environment variables and Supabase Dashboard.
            </Small>
          </CardContent>
        </Card>
      </Stack>
    </Section>
  )
}
