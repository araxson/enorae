/**
 * Staff Analytics - Shared Types
 */

import type { Database } from '@/lib/types/database.types'

export type AppointmentRow = Database['public']['Views']['appointments']['Row']
export type AppointmentServiceRow = Database['public']['Views']['appointment_services']['Row']

export type AppointmentSummary = Pick<
  AppointmentRow,
  'id' | 'customer_id' | 'customer_name' | 'customer_email' | 'created_at' | 'status'
>

export type AppointmentServiceSummary = Pick<
  AppointmentServiceRow,
  'appointment_id' | 'service_id' | 'service_name' | 'service_price' | 'customer_id' | 'staff_id' | 'created_at'
>

export type AppointmentRevenueRow = Pick<AppointmentServiceRow, 'appointment_id' | 'service_price' | 'staff_id'>

export type AppointmentServiceBreakdownRow = Pick<
  AppointmentServiceRow,
  'appointment_id' | 'service_id' | 'service_name' | 'service_price' | 'staff_id' | 'start_time' | 'status'
>
