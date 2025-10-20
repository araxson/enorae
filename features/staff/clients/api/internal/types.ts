import type { Database, Json } from '@/lib/types/database.types'

export type Appointment = Database['public']['Views']['appointments']['Row']

export type ClientWithHistory = {
  customer_id: string
  customer_name: string | null
  customer_email: string | null
  total_appointments: number
  last_appointment_date: string | null
  total_revenue: number | null
}

export type ClientDetail = {
  customer_id: string
  customer_name: string | null
  customer_email: string | null
  customer_phone: string | null
  total_appointments: number
  completed_appointments: number
  cancelled_appointments: number
  total_spent: number
  avg_appointment_value: number
  first_appointment_date: string | null
  last_appointment_date: string | null
  favorite_services: string[]
  return_rate: number
  notes?: string | null
}

export type ClientServiceHistory = {
  service_name: string
  times_booked: number
  total_spent: number
  avg_price: number
  last_booked: string | null
}

export type ClientRetentionMetrics = {
  total_clients: number
  returning_clients: number
  retention_rate: number
  avg_appointments_per_client: number
  loyal_clients: number // 5+ appointments
}

export type ActionResponse<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string }

export type ThreadNote = {
  id: string
  content: string
  created_by: string
  created_at: string
}

export type ThreadPreferences = {
  allergies?: string[]
  preferred_services?: string[]
  notes?: string
  updated_by?: string
  updated_at?: string
}

export type ThreadMetadata = {
  notes?: ThreadNote[]
  preferences?: ThreadPreferences
} & {
  [key: string]: Json | undefined
}
