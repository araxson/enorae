import { NextResponse } from 'next/server'
import { getAppointmentSnapshot } from '@/features/admin/appointments/api/oversight.queries'

export async function GET() {
  try {
    const snapshot = await getAppointmentSnapshot()
    return NextResponse.json({ data: snapshot })
  } catch (error) {
    console.error('[AppointmentOversightAPI] snapshot load failed', error)
    return NextResponse.json({ error: 'Failed to load appointment oversight snapshot' }, { status: 500 })
  }
}
