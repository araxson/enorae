import { NextRequest, NextResponse } from 'next/server'
import { getSalonSearchSuggestions } from '@/features/customer/salon-search/api/queries'
import { RATE_LIMITS, STRING_LIMITS, CACHE_DURATION } from '@/lib/config/constants'
import { logApiCall, logError } from '@/lib/observability'

// SECURITY: Rate limit to prevent abuse
const RATE_LIMIT_WINDOW = RATE_LIMITS.IN_MEMORY_API.windowMs
const RATE_LIMIT_MAX_REQUESTS = RATE_LIMITS.IN_MEMORY_API.limit
const requestCounts = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(request: NextRequest): string {
  // Use IP address for rate limiting
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  return `suggestions:${ip}`
}

function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const record = requestCounts.get(key)

  if (!record || now > record.resetTime) {
    requestCounts.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    })
    return true
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  record.count++
  return true
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  // SECURITY: Apply rate limiting
  const rateLimitKey = getRateLimitKey(request)
  if (!checkRateLimit(rateLimitKey)) {
    logApiCall('GET', '/api/salons/suggestions', {
      operationName: 'salon_search_suggestions',
      statusCode: 429,
      duration: Date.now() - startTime,
    })
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    )
  }

  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  // SECURITY: Validate query length
  if (!query || query.length < STRING_LIMITS.MIN_SEARCH) {
    logApiCall('GET', '/api/salons/suggestions', {
      operationName: 'salon_search_suggestions',
      statusCode: 200,
      duration: Date.now() - startTime,
    })
    return NextResponse.json([])
  }

  // SECURITY: Limit query length to prevent abuse
  if (query.length > STRING_LIMITS.SEARCH_QUERY_MAX) {
    logApiCall('GET', '/api/salons/suggestions', {
      operationName: 'salon_search_suggestions',
      statusCode: 400,
      duration: Date.now() - startTime,
    })
    return NextResponse.json(
      { error: 'Query too long' },
      { status: 400 }
    )
  }

  try {
    const suggestions = await getSalonSearchSuggestions(query)

    logApiCall('GET', '/api/salons/suggestions', {
      operationName: 'salon_search_suggestions',
      statusCode: 200,
      duration: Date.now() - startTime,
    })

    // SECURITY: Add cache headers to reduce load
    return NextResponse.json(suggestions, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_DURATION.METRICS}, stale-while-revalidate=${CACHE_DURATION.METRICS / 2}`,
      },
    })
  } catch (error) {
    logError('Failed to fetch salon suggestions', {
      operationName: 'salon_search_suggestions',
      error: error instanceof Error ? error : String(error),
      errorCategory: 'system',
    })
    // SECURITY: Don't expose internal error details
    return NextResponse.json(
      { error: 'Failed to fetch suggestions' },
      { status: 500 }
    )
  }
}
