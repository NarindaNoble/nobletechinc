import { NextRequest, NextResponse } from 'next/server'
import { realtimeDB } from '@/lib/realtime-mongodb'
import { ObjectId } from 'mongodb'

// GET /api/triggers - Get all triggers for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const isActive = searchParams.get('isActive')
    const actionType = searchParams.get('actionType')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = parseInt(searchParams.get('skip') || '0')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Build filter
    const filter: any = { userId }
    if (isActive !== null && isActive !== undefined) filter.isActive = isActive === 'true'
    if (actionType && actionType !== 'all') filter['action.type'] = actionType

    const options = {
      limit,
      skip,
      sort: { createdAt: -1 }
    }

    const triggers = await realtimeDB.read('triggers', filter, options)
    
    return NextResponse.json({
      success: true,
      data: triggers,
      count: triggers.length
    })
  } catch (error) {
    console.error('Error fetching triggers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch triggers' },
      { status: 500 }
    )
  }
}

// POST /api/triggers - Create new trigger
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { name, description, condition, action, isActive, userId } = body
    if (!name || !condition || !action || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create trigger
    const triggerData = {
      name,
      description: description || '',
      condition,
      action,
      isActive: isActive ?? true,
      userId,
      createdAt: new Date()
    }

    const result = await realtimeDB.create('triggers', triggerData)
    
    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...triggerData }
    })
  } catch (error) {
    console.error('Error creating trigger:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create trigger' },
      { status: 500 }
    )
  }
}
