import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, getUserSalonIds, ROLE_GROUPS } from '@/lib/auth'
import { getServices } from '@/features/business/services/api/queries'
import { getStaff } from '@/features/business/staff/api/queries'
import { logApiCall, logError } from '@/lib/observability'

// Next.js 15+: GET requests are NOT cached by default - must set dynamic explicitly
// Service options are user-specific and require authentication
export const dynamic = 'force-dynamic'

type ServiceOption = { id: string; name: string }
type StaffOption = { id: string; name: string }

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function hasValidId<T extends { id: unknown }>(item: T | null | undefined): item is T & { id: string } {
  return item != null && typeof item.id === 'string'
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ 'appointment-id': string }> }
) {
  const startTime = Date.now()

  try {
    const { 'appointment-id': appointmentId } = await params

    if (!UUID_REGEX.test(appointmentId)) {
      logApiCall('GET', `/api/business/appointments/${appointmentId}/service-options`, {
        operationName: 'get_service_options',
        appointmentId,
        statusCode: 400,
        duration: Date.now() - startTime,
      })
      return NextResponse.json({ error: 'Invalid appointment id' }, { status: 400 })
    }

    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    const accessibleSalonIds = await getUserSalonIds()
    if (!accessibleSalonIds.length) {
      logApiCall('GET', `/api/business/appointments/${appointmentId}/service-options`, {
        operationName: 'get_service_options',
        userId: session.user.id,
        appointmentId,
        statusCode: 403,
        duration: Date.now() - startTime,
      })
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
      logError('Failed to fetch appointment for service options', {
        operationName: 'get_service_options',
        userId: session.user.id,
        appointmentId,
        error: appointmentError,
        errorCategory: 'database',
      })
      // SECURITY: Never expose database error details to client
      return NextResponse.json(
        { error: 'Failed to fetch appointment' },
        { status: 500 }
      )
    }

    if (!appointment?.salon_id) {
      logApiCall('GET', `/api/business/appointments/${appointmentId}/service-options`, {
        operationName: 'get_service_options',
        userId: session.user.id,
        appointmentId,
        statusCode: 404,
        duration: Date.now() - startTime,
      })
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

    logApiCall('GET', `/api/business/appointments/${appointmentId}/service-options`, {
      operationName: 'get_service_options',
      userId: session.user.id,
      salonId,
      appointmentId,
      statusCode: 200,
      duration: Date.now() - startTime,
    })

    return NextResponse.json({
      services: serviceOptions,
      staff: staffOptions,
    })
  } catch (error) {
    logError('Unexpected error loading appointment service options', {
      operationName: 'get_service_options',
      error: error instanceof Error ? error : String(error),
      errorCategory: 'system',
    })
    // SECURITY: Never expose internal error details to client
    return NextResponse.json(
      { error: 'Failed to load appointment service options' },
      { status: 500 }
    )
  }
}
