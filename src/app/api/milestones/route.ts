import { NextRequest, NextResponse } from 'next/server'
import { realtimeDB } from '@/lib/realtime-mongodb'
import { ObjectId } from 'mongodb'

// GET /api/milestones - Get all milestones for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const category = searchParams.get('category')
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
    if (status && status !== 'all') filter.status = status
    if (category && category !== 'all') filter.category = category

    const options = {
      limit,
      skip,
      sort: { targetDate: 1 }
    }

    const milestones = await realtimeDB.read('milestones', filter, options)
    
    return NextResponse.json({
      success: true,
      data: milestones,
      count: milestones.length
    })
  } catch (error) {
    console.error('Error fetching milestones:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch milestones' },
      { status: 500 }
    )
  }
}

// POST /api/milestones - Create new milestone
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { title, description, targetDate, priority, category, status, userId } = body
    if (!title || !targetDate || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create milestone
    const milestoneData = {
      title,
      description: description || '',
      targetDate: new Date(targetDate),
      priority: priority || 'medium',
      category: category || 'project',
      status: status || 'pending',
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await realtimeDB.create('milestones', milestoneData)
    
    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...milestoneData }
    })
  } catch (error) {
    console.error('Error creating milestone:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create milestone' },
      { status: 500 }
    )
  }
}
