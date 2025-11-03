'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, DollarSign, MessageSquare, Star, Users } from 'lucide-react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Item, ItemContent, ItemDescription, ItemGroup } from '@/components/ui/item'
import type {
  AppointmentsOverview,
  MessagesOverview,
  RevenueOverview,
  ReviewsOverview,
  StaffOverview,
} from '../api/types'
import { AdminOverviewRevenueTab } from './admin-overview-revenue-tab'
import { AdminOverviewAppointmentsTab } from './admin-overview-appointments-tab'
import { AdminOverviewReviewsTab } from './admin-overview-reviews-tab'
import { AdminOverviewMessagesTab } from './admin-overview-messages-tab'
import { AdminOverviewStaffTab } from './admin-overview-staff-tab'

export interface AdminOverviewTabsProps {
  revenue: RevenueOverview[]
  appointments: AppointmentsOverview[]
  reviews: ReviewsOverview[]
  messages: MessagesOverview[]
  staff: StaffOverview[]
}

export function AdminOverviewTabs({
  revenue,
  appointments,
  reviews,
  messages,
  staff,
}: AdminOverviewTabsProps) {
  const chartWindow = Math.min(revenue.length, 30)

  return (
    <Tabs defaultValue="revenue">
      <ItemGroup className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Item variant="muted" className="items-center gap-2 text-xs text-muted-foreground">
          <ItemContent>
            <div className="flex items-center gap-2">
              <Calendar className="size-3.5" />
              <ItemDescription>Data refreshes automatically every 60 seconds</ItemDescription>
            </div>
          </ItemContent>
        </Item>
        <ScrollArea className="w-full md:w-auto">
          <TabsList className="flex w-full min-w-max justify-between md:w-auto">
            <TabsTrigger value="revenue">
              <span className="flex items-center gap-1.5">
                <DollarSign className="size-4" />
                Revenue
              </span>
            </TabsTrigger>
            <TabsTrigger value="appointments">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4" />
                Appointments
              </span>
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <span className="flex items-center gap-1.5">
                <Star className="size-4" />
                Reviews
              </span>
            </TabsTrigger>
            <TabsTrigger value="messages">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="size-4" />
                Messages
              </span>
            </TabsTrigger>
            <TabsTrigger value="staff">
              <span className="flex items-center gap-1.5">
                <Users className="size-4" />
                Staff
              </span>
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </ItemGroup>

      <TabsContent value="revenue">
        <AdminOverviewRevenueTab revenue={revenue} windowSize={chartWindow} />
      </TabsContent>

      <TabsContent value="appointments">
        <AdminOverviewAppointmentsTab appointments={appointments} />
      </TabsContent>

      <TabsContent value="reviews">
        <AdminOverviewReviewsTab reviews={reviews} />
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
