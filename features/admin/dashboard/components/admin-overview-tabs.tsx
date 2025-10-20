'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, DollarSign, MessageSquare, Package, Star, Users } from 'lucide-react'
import type {
  AppointmentsOverview,
  InventoryOverview,
  MessagesOverview,
  RevenueOverview,
  ReviewsOverview,
  StaffOverview,
} from './admin-overview-types'
import { AdminOverviewRevenueTab } from './admin-overview-revenue-tab'
import { AdminOverviewAppointmentsTab } from './admin-overview-appointments-tab'
import { AdminOverviewReviewsTab } from './admin-overview-reviews-tab'
import { AdminOverviewInventoryTab } from './admin-overview-inventory-tab'
import { AdminOverviewMessagesTab } from './admin-overview-messages-tab'
import { AdminOverviewStaffTab } from './admin-overview-staff-tab'

export interface AdminOverviewTabsProps {
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
  const chartWindow = Math.min(revenue.length, 30)

  return (
    <Tabs defaultValue="revenue" className="w-full gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          Data refreshes automatically every 60 seconds
        </div>
        <TabsList className="w-full justify-between overflow-x-auto md:w-auto">
          <TabsTrigger value="revenue">
            <span className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4" />
              Revenue
            </span>
          </TabsTrigger>
          <TabsTrigger value="appointments">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Appointments
            </span>
          </TabsTrigger>
          <TabsTrigger value="reviews">
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4" />
              Reviews
            </span>
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <span className="flex items-center gap-1.5">
              <Package className="h-4 w-4" />
              Inventory
            </span>
          </TabsTrigger>
          <TabsTrigger value="messages">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4" />
              Messages
            </span>
          </TabsTrigger>
          <TabsTrigger value="staff">
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              Staff
            </span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="revenue">
        <AdminOverviewRevenueTab revenue={revenue} windowSize={chartWindow} />
      </TabsContent>

      <TabsContent value="appointments">
        <AdminOverviewAppointmentsTab appointments={appointments} />
      </TabsContent>

      <TabsContent value="reviews">
        <AdminOverviewReviewsTab reviews={reviews} />
      </TabsContent>

      <TabsContent value="inventory">
        <AdminOverviewInventoryTab inventory={inventory} />
      </TabsContent>

      <TabsContent value="messages">
        <AdminOverviewMessagesTab messages={messages} />
      </TabsContent>

      <TabsContent value="staff">
        <AdminOverviewStaffTab staff={staff} />
      </TabsContent>
    </Tabs>
  )
}
