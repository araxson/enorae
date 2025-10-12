import { NextResponse } from 'next/server'
import { getSecurityMonitoringSnapshot } from '@/features/admin/security-monitoring/api/queries'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const windowHoursParam = url.searchParams.get('windowHours')
  const windowInHours = windowHoursParam ? Number(windowHoursParam) : undefined
  const options = Number.isFinite(windowInHours) && windowInHours ? { windowInHours } : {}

  try {
    const snapshot = await getSecurityMonitoringSnapshot(options)
    return NextResponse.json({ data: snapshot })
  } catch (error) {
    console.error('[SecurityMonitoringAPI] Failed to load snapshot', error)
    return NextResponse.json(
      { error: 'Failed to load security monitoring snapshot' },
      { status: 500 }
    )
  }
}
