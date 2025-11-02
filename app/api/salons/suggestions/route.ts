import { NextRequest, NextResponse } from 'next/server'
import { getSalonSearchSuggestions } from '@/features/customer/salon-search/api/queries'

// SECURITY: Rate limit to prevent abuse
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30
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
  // SECURITY: Apply rate limiting
  const rateLimitKey = getRateLimitKey(request)
  if (!checkRateLimit(rateLimitKey)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    )
  }

  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  // SECURITY: Validate query length
  if (!query || query.length < 2) {
    return NextResponse.json([])
  }

  // SECURITY: Limit query length to prevent abuse
  if (query.length > 100) {
    return NextResponse.json(
      { error: 'Query too long' },
      { status: 400 }
    )
  }

  try {
    const suggestions = await getSalonSearchSuggestions(query)

    // SECURITY: Add cache headers to reduce load
    return NextResponse.json(suggestions, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    })
  } catch (error) {
    console.error('Error fetching suggestions:', error)
    // SECURITY: Don't expose internal error details
    return NextResponse.json(
      { error: 'Failed to fetch suggestions' },
      { status: 500 }
    )
  }
}
