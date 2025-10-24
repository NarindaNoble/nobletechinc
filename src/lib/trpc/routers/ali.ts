import { z } from 'zod'
import { router, protectedProcedure } from '../server'
import { prisma } from '@/lib/prisma/client'
import { getDatabase } from '@/lib/mongodb'
import { mockProjects, mockMetrics, mockTickets } from '@/lib/mock-data'

export const aliRouter = router({
  // Get project vital signs for dashboard
  getProjectVitals: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input }) => {
      try {
        const db = await getDatabase()
        
        // Get project
        const project = await db.collection('projects').findOne({ _id: input.projectId })
        if (!project) {
          throw new Error('Project not found')
        }

        // Get latest metrics
        const metrics = await db.collection('project_metrics')
          .find({ projectId: input.projectId })
          .sort({ timestamp: -1 })
          .limit(100)
          .toArray()

        // Get open tickets
        const openTickets = await db.collection('maintenance_tickets')
          .countDocuments({ 
            projectId: input.projectId, 
            status: 'OPEN' 
          })

        // Calculate vital signs from metrics
        const latestMetrics = metrics.slice(0, 7) // Last 7 days
        const uptime = latestMetrics.find(m => m.metricType === 'UPTIME_PERCENTAGE')?.value || 0
        const errorRate = latestMetrics.find(m => m.metricType === 'ERROR_RATE')?.value || 0
        const cloudSpend = latestMetrics.find(m => m.metricType === 'CLOUD_SPEND')?.value || 0

        return {
          projectId: project._id.toString(),
          projectName: project.name,
          uptime: Math.round(uptime * 100) / 100,
          errorRate: Math.round(errorRate * 100) / 100,
          cloudSpend: Math.round(cloudSpend * 100) / 100,
          openTickets,
          healthScore: calculateHealthScore(uptime, errorRate, openTickets),
          trends: {
            uptime: calculateTrend(latestMetrics.filter(m => m.metricType === 'UPTIME_PERCENTAGE')),
            errorRate: calculateTrend(latestMetrics.filter(m => m.metricType === 'ERROR_RATE')),
            cloudSpend: calculateTrend(latestMetrics.filter(m => m.metricType === 'CLOUD_SPEND')),
          },
        }
      } catch (error) {
        // Fallback to mock data if MongoDB is not available
        console.log('Using mock data for development')
        
        const project = mockProjects[0]
        const metrics = mockMetrics
        const openTickets = mockTickets.filter(t => t.status === 'OPEN').length

        const uptime = metrics.find(m => m.metricType === 'UPTIME_PERCENTAGE')?.value || 0
        const errorRate = metrics.find(m => m.metricType === 'ERROR_RATE')?.value || 0
        const cloudSpend = metrics.find(m => m.metricType === 'CLOUD_SPEND')?.value || 0

        return {
          projectId: project._id,
          projectName: project.name,
          uptime: Math.round(uptime * 100) / 100,
          errorRate: Math.round(errorRate * 100) / 100,
          cloudSpend: Math.round(cloudSpend * 100) / 100,
          openTickets,
          healthScore: calculateHealthScore(uptime, errorRate, openTickets),
          trends: {
            uptime: 'STABLE' as const,
            errorRate: 'DOWN' as const,
            cloudSpend: 'UP' as const,
          },
        }
      }
    }),

  // Get project timeline with deployments and incidents
  getProjectTimeline: protectedProcedure
    .input(z.object({ 
      projectId: z.string(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDatabase()
      const startDate = input.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
      const endDate = input.endDate || new Date()

      const metrics = await db.collection('project_metrics')
        .find({
          projectId: input.projectId,
          timestamp: {
            $gte: startDate,
            $lte: endDate,
          },
        })
        .sort({ timestamp: -1 })
        .toArray()

      const tickets = await db.collection('maintenance_tickets')
        .find({
          projectId: input.projectId,
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        })
        .sort({ createdAt: -1 })
        .toArray()

      // Group metrics by day and create timeline events
      const timelineEvents = []
      
      // Add deployment events (mock for now - would come from CI/CD integration)
      timelineEvents.push({
        id: 'deploy-1',
        type: 'DEPLOYMENT',
        title: 'Production Deployment v2.1.0',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        impact: 'POSITIVE',
      })

      // Add incident events from tickets
      tickets.forEach(ticket => {
        if (ticket.priority === 'CRITICAL' || ticket.priority === 'HIGH') {
          timelineEvents.push({
            id: ticket._id.toString(),
            type: 'INCIDENT',
            title: ticket.title,
            timestamp: ticket.createdAt,
            impact: ticket.priority === 'CRITICAL' ? 'NEGATIVE' : 'WARNING',
          })
        }
      })

      return {
        events: timelineEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
        metrics: metrics.map(m => ({
          timestamp: m.timestamp,
          type: m.metricType,
          value: m.value,
          unit: m.unit,
        })),
      }
    }),

  // Set budget alert threshold
  setBudgetAlert: protectedProcedure
    .input(z.object({ 
      projectId: z.string(),
      threshold: z.number().min(0),
    }))
    .mutation(async ({ input }) => {
      // This would typically store the alert in a separate alerts table
      // For now, we'll just return success
      return {
        success: true,
        message: `Budget alert set at $${input.threshold}`,
      }
    }),

  // Get TCO forecast
  getTCOForecast: protectedProcedure
    .input(z.object({ 
      projectId: z.string(),
      months: z.number().min(1).max(24).default(12),
    }))
    .query(async ({ input }) => {
      // Mock TCO forecast data - would be generated by ML model
      const currentDate = new Date()
      const forecast = []
      
      for (let i = 1; i <= input.months; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1)
        const baseCost = 5000 + (i * 200) // Simulated growth
        const variance = (Math.random() - 0.5) * 1000 // Random variance
        
        forecast.push({
          month: date.toISOString().slice(0, 7),
          predicted: Math.round(baseCost + variance),
          confidence: Math.max(0.6, 1 - (i * 0.02)), // Decreasing confidence over time
          bestCase: Math.round((baseCost + variance) * 0.8),
          worstCase: Math.round((baseCost + variance) * 1.3),
        })
      }

      return {
        projectId: input.projectId,
        forecast,
        totalPredicted: forecast.reduce((sum, f) => sum + f.predicted, 0),
        confidence: forecast[forecast.length - 1]?.confidence || 0.6,
      }
    }),
})

// Helper functions
function calculateHealthScore(uptime: number, errorRate: number, openTickets: number): 'HEALTHY' | 'WARNING' | 'CRITICAL' {
  if (uptime < 95 || errorRate > 5 || openTickets > 10) return 'CRITICAL'
  if (uptime < 98 || errorRate > 2 || openTickets > 5) return 'WARNING'
  return 'HEALTHY'
}

function calculateTrend(metrics: any[]): 'UP' | 'DOWN' | 'STABLE' {
  if (metrics.length < 2) return 'STABLE'
  
  const recent = metrics.slice(0, 3).reduce((sum, m) => sum + m.value, 0) / 3
  const older = metrics.slice(3, 6).reduce((sum, m) => sum + m.value, 0) / 3
  
  const change = ((recent - older) / older) * 100
  
  if (change > 5) return 'UP'
  if (change < -5) return 'DOWN'
  return 'STABLE'
}
