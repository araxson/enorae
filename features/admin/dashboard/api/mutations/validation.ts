'use server'

import { z } from 'zod'

import type { AppointmentStatus } from '../../types'

export const VALID_APPOINTMENT_STATUSES: AppointmentStatus[] = [
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'no_show',
]

export const BULK_ALERT_IDS_SCHEMA = z.array(z.string().uuid()).min(1).max(500)
export const BULK_USER_IDS_SCHEMA = z.array(z.string().uuid()).min(1).max(100)
