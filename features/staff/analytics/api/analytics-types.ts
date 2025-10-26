/**
 * Staff Analytics - Shared Types
 */

import type { Database } from '@/lib/types/database.types'

export type AppointmentRow = Database['public']['Views']['appointments_view']['Row']
export type AppointmentServiceRow = Database['scheduling']['Tables']['appointment_services']['Row']

export type AppointmentSummary = Pick<
  AppointmentRow,
  'id' | 'customer_id' | 'created_at' | 'start_time' | 'status'
>

export type AppointmentServiceSummary = Pick<
  AppointmentServiceRow,
  'appointment_id' | 'service_id' | 'staff_id' | 'created_at'
>

export type AppointmentRevenueRow = Pick<AppointmentServiceRow, 'appointment_id' | 'staff_id'>

export type AppointmentServiceBreakdownRow = Pick<
  AppointmentServiceRow,
  'appointment_id' | 'service_id' | 'staff_id' | 'start_time' | 'status'
>
