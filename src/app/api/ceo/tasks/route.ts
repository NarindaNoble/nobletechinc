import { NextRequest, NextResponse } from 'next/server'
import { realtimeDB } from '@/lib/realtime-mongodb'

// GET /api/ceo/tasks - Get CEO tasks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'current-user-id'
    const limit = parseInt(searchParams.get('limit') || '10')

    const db = await realtimeDB['db']
    
    // Get tasks from CEO tasks collection
    const tasks = await db.collection('ceo_tasks')
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()

    // Transform tasks to match expected format
    const transformedTasks = tasks.map(task => ({
      id: task._id.toString(),
      title: task.title,
      due: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date',
      priority: task.priority || 'MEDIUM',
      status: task.status || 'pending'
    }))

    return NextResponse.json({
      success: true,
      data: transformedTasks
    })
  } catch (error) {
    console.error('Error fetching CEO tasks:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}
