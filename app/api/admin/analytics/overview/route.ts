import { NextResponse } from 'next/server'
import { getPlatformAnalyticsSnapshot } from '@/features/admin/analytics/api/platform-analytics.queries'

export async function GET() {
  try {
    const snapshot = await getPlatformAnalyticsSnapshot()
    return NextResponse.json({ data: snapshot })
  } catch (error) {
    console.error('[AdminAnalyticsAPI] snapshot load failed', error)
    return NextResponse.json({ error: 'Failed to load analytics snapshot' }, { status: 500 })
  }
}
