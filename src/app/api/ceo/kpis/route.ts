import { NextRequest, NextResponse } from 'next/server'
import { realtimeDB } from '@/lib/realtime-mongodb'

// GET /api/ceo/kpis - Get CEO KPIs
export async function GET(request: NextRequest) {
  try {
    const db = await realtimeDB['db']
    
    // Get real-time KPIs from various collections
    const [projects, users, metrics] = await Promise.all([
      db.collection('projects').countDocuments({ status: 'ACTIVE' }),
      db.collection('users').countDocuments({ status: 'active' }),
      db.collection('project_metrics').aggregate([
        {
          $group: {
            _id: null,
            avgHealth: { $avg: '$value' },
            totalSpend: { $sum: '$value' }
          }
        }
      ]).toArray()
    ])

    const kpis = {
      activeProjects: projects,
      pipelineValue: 2500000, // This would come from actual pipeline data
      clientHealth: Math.round(metrics[0]?.avgHealth || 0),
      teamCapacity: Math.round((users / 10) * 100) // Assuming 10 is max team size
    }

    return NextResponse.json({
      success: true,
      data: kpis
    })
  } catch (error) {
    console.error('Error fetching CEO KPIs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch KPIs' },
      { status: 500 }
    )
  }
}
