import { NextResponse } from 'next/server'
import { getSecurityMonitoringSnapshot } from '@/features/admin/security-monitoring/api/queries'
import { requireAnyRole } from '@/lib/auth/session'
import { validateCSRFSafe } from '@/lib/csrf'
import { logApiCall, logError, logAuthEvent } from '@/lib/observability'

// Next.js 15+: GET requests are NOT cached by default - must set dynamic explicitly
// Security monitoring is real-time and user-specific
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const startTime = Date.now()

  // CRITICAL SECURITY: Verify admin role before allowing access
  try {
    const session = await requireAnyRole(['super_admin', 'platform_admin'])

    // CRITICAL SECURITY: Validate CSRF token
    const csrfValidation = await validateCSRFSafe()
    if (!csrfValidation.success) {
      logAuthEvent('permission_check', {
        operationName: 'admin_security_monitoring',
        userId: session.user.id,
        success: false,
        reason: 'CSRF validation failed',
      })
      logApiCall('GET', '/api/admin/security/monitoring', {
        operationName: 'admin_security_monitoring',
        userId: session.user.id,
        statusCode: 403,
        duration: Date.now() - startTime,
      })
      return NextResponse.json(
        { error: 'CSRF validation failed' },
        { status: 403 }
      )
    }

    const url = new URL(request.url)
    const windowHoursParam = url.searchParams.get('windowHours')
    const windowInHours = windowHoursParam ? Number(windowHoursParam) : undefined
    const options = Number.isFinite(windowInHours) && windowInHours ? { windowInHours } : {}

    try {
      const snapshot = await getSecurityMonitoringSnapshot(options)

      logApiCall('GET', '/api/admin/security/monitoring', {
        operationName: 'admin_security_monitoring',
        userId: session.user.id,
        statusCode: 200,
        duration: Date.now() - startTime,
      })

      return NextResponse.json({ data: snapshot })
    } catch (error) {
      logError('Failed to load security monitoring snapshot', {
        operationName: 'admin_security_monitoring',
        userId: session.user.id,
        error: error instanceof Error ? error : String(error),
        errorCategory: 'system',
      })
      return NextResponse.json(
        { error: 'Failed to load security monitoring snapshot' },
        { status: 500 }
      )
    }
  } catch (authError) {
    logAuthEvent('permission_check', {
      operationName: 'admin_security_monitoring',
      success: false,
      reason: authError instanceof Error ? authError.message : 'Unauthorized',
    })
    logApiCall('GET', '/api/admin/security/monitoring', {
      operationName: 'admin_security_monitoring',
      statusCode: 401,
      duration: Date.now() - startTime,
    })
    return NextResponse.json(
      { error: 'Unauthorized - Admin access required' },
      { status: 401 }
    )
  }
}
