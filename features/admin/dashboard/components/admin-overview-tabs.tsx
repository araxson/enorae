import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Stack, Box, Grid } from '@/components/layout'
import { Small, Muted } from '@/components/ui/typography'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Calendar, Star, Package, MessageSquare, Users } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type RevenueOverview = Database['public']['Views']['admin_revenue_overview']['Row']
type AppointmentsOverview = Database['public']['Views']['admin_appointments_overview']['Row']
type ReviewsOverview = Database['public']['Views']['admin_reviews_overview']['Row']
type InventoryOverview = Database['public']['Views']['admin_inventory_overview']['Row']
type MessagesOverview = Database['public']['Views']['admin_messages_overview']['Row']
type StaffOverview = Database['public']['Views']['admin_staff_overview']['Row']

interface AdminOverviewTabsProps {
  revenue: RevenueOverview[]
  appointments: AppointmentsOverview[]
  reviews: ReviewsOverview[]
  inventory: InventoryOverview[]
  messages: MessagesOverview[]
  staff: StaffOverview[]
}

export function AdminOverviewTabs({
  revenue,
  appointments,
  reviews,
  inventory,
  messages,
  staff,
}: AdminOverviewTabsProps) {
  return (
    <Tabs defaultValue="revenue" className="w-full">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="revenue" className="gap-1">
          <DollarSign className="h-4 w-4" />
          Revenue
        </TabsTrigger>
        <TabsTrigger value="appointments" className="gap-1">
          <Calendar className="h-4 w-4" />
          Appointments
        </TabsTrigger>
        <TabsTrigger value="reviews" className="gap-1">
          <Star className="h-4 w-4" />
          Reviews
        </TabsTrigger>
        <TabsTrigger value="inventory" className="gap-1">
          <Package className="h-4 w-4" />
          Inventory
        </TabsTrigger>
        <TabsTrigger value="messages" className="gap-1">
          <MessageSquare className="h-4 w-4" />
          Messages
        </TabsTrigger>
        <TabsTrigger value="staff" className="gap-1">
          <Users className="h-4 w-4" />
          Staff
        </TabsTrigger>
      </TabsList>

      <TabsContent value="revenue">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Platform-wide revenue analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="md">
              {revenue.slice(0, 10).map((item, idx) => (
                <Box key={idx} className="p-4 border rounded-lg">
                  <Small className="text-muted-foreground">
                    {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                  </Small>
                  <div className="text-2xl font-bold">
                    ${(item.total_revenue || 0).toLocaleString()}
                  </div>
                  <Muted className="text-xs">
                    {item.total_appointments || 0} appointments
                  </Muted>
                </Box>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="appointments">
        <Card>
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
            <CardDescription>Latest platform appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Stack gap="sm">
              {appointments.slice(0, 10).map((apt) => (
                <Box key={apt.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <Stack gap="xs">
                    <Small className="font-medium">{apt.salon_name || 'Unknown Salon'}</Small>
                    <Muted className="text-xs">
                      {apt.customer_name || 'Unknown Customer'} • {apt.service_name || 'Unknown Service'}
                    </Muted>
                  </Stack>
                  <Badge variant={apt.status === 'completed' ? 'default' : 'secondary'}>
                    {apt.status || 'pending'}
                  </Badge>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="reviews">
        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
            <CardDescription>Platform review moderation</CardDescription>
          </CardHeader>
          <CardContent>
            <Stack gap="sm">
              {reviews.slice(0, 10).map((review) => (
                <Box key={review.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Small className="font-medium">{review.salon_name || 'Unknown Salon'}</Small>
                    <Badge variant="outline">
                      <Star className="h-3 w-3 mr-1" />
                      {review.rating || 0}/5
                    </Badge>
                  </div>
                  <Muted className="text-sm line-clamp-2">
                    {review.comment || 'No comment'}
                  </Muted>
                  <Muted className="text-xs mt-1">
                    By {review.customer_name || 'Anonymous'}
                  </Muted>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="inventory">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Alerts</CardTitle>
            <CardDescription>Low stock and critical alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <Stack gap="sm">
              {inventory.slice(0, 10).map((item) => (
                <Box key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <Stack gap="xs">
                    <Small className="font-medium">{item.product_name || 'Unknown Product'}</Small>
                    <Muted className="text-xs">
                      {item.salon_name || 'Unknown Salon'} • Stock: {item.current_stock || 0}
                    </Muted>
                  </Stack>
                  <Badge variant="destructive">
                    Low Stock
                  </Badge>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="messages">
        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>Platform communication activity</CardDescription>
          </CardHeader>
          <CardContent>
            <Stack gap="sm">
              {messages.slice(0, 10).map((msg) => (
                <Box key={msg.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <Small className="font-medium">{msg.sender_name || 'Unknown Sender'}</Small>
                    <Muted className="text-xs">
                      {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : 'N/A'}
                    </Muted>
                  </div>
                  <Muted className="text-sm line-clamp-1">
                    To: {msg.recipient_name || 'Unknown Recipient'}
                  </Muted>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="staff">
        <Card>
          <CardHeader>
            <CardTitle>Staff Performance</CardTitle>
            <CardDescription>Platform-wide staff overview</CardDescription>
          </CardHeader>
          <CardContent>
            <Stack gap="sm">
              {staff.slice(0, 10).map((member) => (
                <Box key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <Stack gap="xs">
                    <Small className="font-medium">{member.staff_name || 'Unknown Staff'}</Small>
                    <Muted className="text-xs">
                      {member.salon_name || 'Unknown Salon'} • {member.role || 'staff'}
                    </Muted>
                  </Stack>
                  <Badge variant="outline">
                    {member.total_appointments || 0} appointments
                  </Badge>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
