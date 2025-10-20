import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Section, Stack, Grid } from '@/components/layout'
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
                <small className="text-sm font-medium leading-none text-muted-foreground">
                  • Password policies
                </small>
                <small className="text-sm font-medium leading-none text-muted-foreground">
                  • Two-factor authentication
                </small>
                <small className="text-sm font-medium leading-none text-muted-foreground">
                  • Session management
                </small>
                <small className="text-sm font-medium leading-none text-muted-foreground">
                  • Rate limiting configuration
                </small>
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
                <small className="text-sm font-medium leading-none text-muted-foreground">
                  • SMTP provider settings
                </small>
                <small className="text-sm font-medium leading-none text-muted-foreground">
                  • Email templates
                </small>
                <small className="text-sm font-medium leading-none text-muted-foreground">
                  • Notification preferences
                </small>
                <small className="text-sm font-medium leading-none text-muted-foreground">
                  • Delivery monitoring
                </small>
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
                <small className="text-sm font-medium leading-none text-muted-foreground">
                  • Admin notifications
                </small>
                <small className="text-sm font-medium leading-none text-muted-foreground">
                  • System alerts
                </small>
                <small className="text-sm font-medium leading-none text-muted-foreground">
                  • Error notifications
                </small>
                <small className="text-sm font-medium leading-none text-muted-foreground">
                  • Webhook configurations
                </small>
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
                <small className="text-sm font-medium leading-none text-muted-foreground">
                  • Connection pooling
                </small>
                <small className="text-sm font-medium leading-none text-muted-foreground">
                  • Query optimization
                </small>
                <small className="text-sm font-medium leading-none text-muted-foreground">
                  • Backup configuration
                </small>
                <small className="text-sm font-medium leading-none text-muted-foreground">
                  • Index management
                </small>
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
                <small className="text-sm font-medium leading-none text-muted-foreground">
                  • Platform name and branding
                </small>
                <small className="text-sm font-medium leading-none text-muted-foreground">
                  • Default locale and timezone
                </small>
                <small className="text-sm font-medium leading-none text-muted-foreground">
                  • Feature flags
                </small>
                <small className="text-sm font-medium leading-none text-muted-foreground">
                  • Maintenance mode
                </small>
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
            <small className="text-sm font-medium leading-none text-muted-foreground">
              For now, platform configuration is managed through environment variables and Supabase Dashboard.
            </small>
          </CardContent>
        </Card>
      </Stack>
    </Section>
  )
}
