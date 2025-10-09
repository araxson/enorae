import { NextRequest, NextResponse } from 'next/server'
import { getSalonSearchSuggestions } from '@/features/customer/salon-search/api/queries'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const q = searchParams.get('q')

  if (!q || q.length < 2) {
    return NextResponse.json([])
  }

  try {
    const suggestions = await getSalonSearchSuggestions(q)
    return NextResponse.json(suggestions)
  } catch (error) {
    console.error('Error fetching suggestions:', error)
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 })
  }
}
