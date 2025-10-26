import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, getUserSalonIds, ROLE_GROUPS } from '@/lib/auth'
import { getServices } from '@/features/business/services/api/queries'
import { getStaff } from '@/features/business/staff/api/queries'

type ServiceOption = { id: string; name: string }
type StaffOption = { id: string; name: string }

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function hasValidId<T extends { id: unknown }>(item: T | null | undefined): item is T & { id: string } {
  return item != null && typeof item.id === 'string'
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  try {
    const { appointmentId } = await params

    if (!UUID_REGEX.test(appointmentId)) {
      return NextResponse.json({ error: 'Invalid appointment id' }, { status: 400 })
    }

    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    const accessibleSalonIds = await getUserSalonIds()
    if (!accessibleSalonIds.length) {
      return NextResponse.json({ error: 'No accessible salons' }, { status: 403 })
    }

    const supabase = await createClient()
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments_view')
      .select('salon_id')
      .eq('id', appointmentId)
      .in('salon_id', accessibleSalonIds)
      .maybeSingle<{ salon_id: string | null }>()

    if (appointmentError) {
      return NextResponse.json(
        { error: appointmentError.message },
        { status: 500 }
      )
    }

    if (!appointment?.salon_id) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    const salonId = appointment.salon_id

    const [services, staff] = await Promise.all([
      getServices(salonId),
      getStaff(salonId),
    ])

    const serviceOptions: ServiceOption[] = (services ?? [])
      .filter(hasValidId)
      .map((service) => ({
        id: service.id,
        name: service.name ?? 'Untitled service',
      }))

    const staffOptions: StaffOption[] = (staff ?? [])
      .filter(hasValidId)
      .map((member) => ({
        id: member.id,
        name: member.full_name ?? 'Team member',
      }))

    return NextResponse.json({
      services: serviceOptions,
      staff: staffOptions,
    })
  } catch (error) {
    console.error('[service-options] Failed to load options', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to load appointment service options',
      },
      { status: 500 }
    )
  }
}
