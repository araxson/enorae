import type { StaffWithServices } from '../../api/queries'
import type { Database } from '@/lib/types/database.types'

export type StaffMemberWithServices = StaffWithServices
export type ServiceRow = Database['public']['Views']['services']['Row']
