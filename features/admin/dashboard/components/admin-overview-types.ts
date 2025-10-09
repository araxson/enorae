import type { Database } from '@/lib/types/database.types'

export type RevenueOverview = Database['public']['Views']['admin_revenue_overview']['Row']
export type AppointmentsOverview = Database['public']['Views']['admin_appointments_overview']['Row']
export type ReviewsOverview = Database['public']['Views']['admin_reviews_overview']['Row']
export type InventoryOverview = Database['public']['Views']['admin_inventory_overview']['Row']
export type MessagesOverview = Database['public']['Views']['admin_messages_overview']['Row']
export type StaffOverview = Database['public']['Views']['admin_staff_overview']['Row']
