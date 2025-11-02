import { NextRequest, NextResponse } from 'next/server'
import { getSalonSearchSuggestions } from '@/features/customer/salon-search/api/queries'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  if (!query || query.length < 2) {
    return NextResponse.json([])
  }

  try {
    const suggestions = await getSalonSearchSuggestions(query)
    return NextResponse.json(suggestions)
  } catch (error) {
    console.error('Error fetching suggestions:', error)
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 })
  }
}
