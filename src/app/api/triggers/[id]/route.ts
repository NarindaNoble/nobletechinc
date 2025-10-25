import { NextRequest, NextResponse } from 'next/server'
import { realtimeDB } from '@/lib/realtime-mongodb'
import { ObjectId } from 'mongodb'

// GET /api/triggers/[id] - Get specific trigger
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid trigger ID' },
        { status: 400 }
      )
    }

    const trigger = await realtimeDB.readOne('triggers', { _id: new ObjectId(id) })
    
    if (!trigger) {
      return NextResponse.json(
        { success: false, error: 'Trigger not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: trigger
    })
  } catch (error) {
    console.error('Error fetching trigger:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trigger' },
      { status: 500 }
    )
  }
}

// PUT /api/triggers/[id] - Update trigger
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid trigger ID' },
        { status: 400 }
      )
    }

    // Check if trigger exists
    const existingTrigger = await realtimeDB.readOne('triggers', { _id: new ObjectId(id) })
    if (!existingTrigger) {
      return NextResponse.json(
        { success: false, error: 'Trigger not found' },
        { status: 404 }
      )
    }

    // Update trigger
    const updateData = {
      ...body,
      updatedAt: new Date()
    }

    const result = await realtimeDB.update('triggers', { _id: new ObjectId(id) }, updateData)
    
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
    console.error('Error updating trigger:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update trigger' },
      { status: 500 }
    )
  }
}

// DELETE /api/triggers/[id] - Delete trigger
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid trigger ID' },
        { status: 400 }
      )
    }

    // Check if trigger exists
    const existingTrigger = await realtimeDB.readOne('triggers', { _id: new ObjectId(id) })
    if (!existingTrigger) {
      return NextResponse.json(
        { success: false, error: 'Trigger not found' },
        { status: 404 }
      )
    }

    // Delete trigger
    const result = await realtimeDB.delete('triggers', { _id: new ObjectId(id) })
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete trigger' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Trigger deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting trigger:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete trigger' },
      { status: 500 }
    )
  }
}
