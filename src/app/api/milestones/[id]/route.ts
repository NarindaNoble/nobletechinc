import { NextRequest, NextResponse } from 'next/server'
import { realtimeDB } from '@/lib/realtime-mongodb'
import { ObjectId } from 'mongodb'

// GET /api/milestones/[id] - Get specific milestone
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid milestone ID' },
        { status: 400 }
      )
    }

    const milestone = await realtimeDB.readOne('milestones', { _id: new ObjectId(id) })
    
    if (!milestone) {
      return NextResponse.json(
        { success: false, error: 'Milestone not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: milestone
    })
  } catch (error) {
    console.error('Error fetching milestone:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch milestone' },
      { status: 500 }
    )
  }
}

// PUT /api/milestones/[id] - Update milestone
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid milestone ID' },
        { status: 400 }
      )
    }

    // Check if milestone exists
    const existingMilestone = await realtimeDB.readOne('milestones', { _id: new ObjectId(id) })
    if (!existingMilestone) {
      return NextResponse.json(
        { success: false, error: 'Milestone not found' },
        { status: 404 }
      )
    }

    // Update milestone
    const updateData = {
      ...body,
      updatedAt: new Date()
    }

    // If targetDate is being updated, check if it's overdue
    if (body.targetDate) {
      const targetDate = new Date(body.targetDate)
      const now = new Date()
      if (targetDate < now && updateData.status !== 'completed') {
        updateData.status = 'overdue'
      }
    }

    const result = await realtimeDB.update('milestones', { _id: new ObjectId(id) }, updateData)
    
    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'No changes made' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { _id: id, ...updateData }
    })
  } catch (error) {
    console.error('Error updating milestone:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update milestone' },
      { status: 500 }
    )
  }
}

// DELETE /api/milestones/[id] - Delete milestone
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid milestone ID' },
        { status: 400 }
      )
    }

    // Check if milestone exists
    const existingMilestone = await realtimeDB.readOne('milestones', { _id: new ObjectId(id) })
    if (!existingMilestone) {
      return NextResponse.json(
        { success: false, error: 'Milestone not found' },
        { status: 404 }
      )
    }

    // Delete milestone
    const result = await realtimeDB.delete('milestones', { _id: new ObjectId(id) })
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete milestone' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Milestone deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting milestone:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete milestone' },
      { status: 500 }
    )
  }
}
