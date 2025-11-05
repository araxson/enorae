import { NextResponse } from 'next/server'
import { getAppointmentSnapshot } from '@/features/admin/appointments/api/queries'
import { requireAnyRole } from '@/lib/auth/session'
import { validateCSRFSafe } from '@/lib/csrf'

// Next.js 15+: GET requests are NOT cached by default - must set dynamic explicitly
// Admin appointment oversight is user-specific and requires authentication
export const dynamic = 'force-dynamic'

export async function GET() {
  // CRITICAL SECURITY: Verify admin role before allowing access
  try {
    await requireAnyRole(['super_admin', 'platform_admin'])
  } catch (authError) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin access required' },
      { status: 401 }
    )
  }

  // CRITICAL SECURITY: Validate CSRF token
  const csrfValidation = await validateCSRFSafe()
  if (!csrfValidation.success) {
    return NextResponse.json(
      { error: 'CSRF validation failed' },
      { status: 403 }
    )
  }

  try {
    const snapshot = await getAppointmentSnapshot()
    return NextResponse.json({ data: snapshot })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load appointment oversight snapshot' }, { status: 500 })
  }
}
