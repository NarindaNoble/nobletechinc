import { NextRequest, NextResponse } from 'next/server'
import { realtimeDB } from '@/lib/realtime-mongodb'

// GET /api/ceo/communications - Get CEO communications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'current-user-id'
    const limit = parseInt(searchParams.get('limit') || '10')

    const db = await realtimeDB['db']
    
    // Get communications from communication items collection
    const communications = await db.collection('communication_items')
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()

    // Transform communications to match expected format
    const transformedCommunications = communications.map(comm => ({
      id: comm._id.toString(),
      type: comm.type || 'EMAIL',
      title: comm.subject || comm.title,
      from: comm.sender || comm.from,
      urgency: comm.urgency || 'MEDIUM',
      timestamp: comm.createdAt ? new Date(comm.createdAt).toLocaleString() : 'Unknown'
    }))

    return NextResponse.json({
      success: true,
      data: transformedCommunications
    })
  } catch (error) {
    console.error('Error fetching CEO communications:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch communications' },
      { status: 500 }
    )
  }
}
