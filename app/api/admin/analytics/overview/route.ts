import { NextResponse } from 'next/server'
import { getPlatformAnalyticsSnapshot } from '@/features/admin/analytics/api/queries'
import { requireAnyRole } from '@/lib/auth/session'
import { validateCSRFSafe } from '@/lib/csrf'

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
    const snapshot = await getPlatformAnalyticsSnapshot()
    return NextResponse.json({ data: snapshot })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load analytics snapshot' }, { status: 500 })
  }
}
