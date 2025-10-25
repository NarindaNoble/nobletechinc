import { realtimeDB } from './realtime-mongodb'
import { ObjectId } from 'mongodb'

interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'milestone' | 'trigger' | 'system' | 'reminder'
  priority: 'low' | 'medium' | 'high' | 'critical'
  isRead: boolean
  actionUrl?: string
  metadata?: Record<string, any>
  createdAt: Date
  expiresAt?: Date
}

interface TriggerContext {
  userId: string
  milestoneId?: string
  projectId?: string
  timestamp: Date
  data?: Record<string, any>
}

export class NotificationSystem {
  private static instance: NotificationSystem
  private checkInterval: NodeJS.Timeout | null = null

  private constructor() {
    this.startTriggerMonitoring()
  }

  public static getInstance(): NotificationSystem {
    if (!NotificationSystem.instance) {
      NotificationSystem.instance = new NotificationSystem()
    }
    return NotificationSystem.instance
  }

  // Start monitoring triggers
  private startTriggerMonitoring() {
    // Check triggers every minute
    this.checkInterval = setInterval(async () => {
      await this.checkAllTriggers()
    }, 60000)
  }

  // Check all active triggers
  private async checkAllTriggers() {
    try {
      const db = await realtimeDB['db']
      const activeTriggers = await db.collection('triggers').find({ isActive: true }).toArray()
      
      for (const trigger of activeTriggers) {
        await this.evaluateTrigger(trigger)
      }
    } catch (error) {
      console.error('Error checking triggers:', error)
    }
  }

  // Evaluate a single trigger
  private async evaluateTrigger(trigger: any) {
    try {
      const condition = trigger.condition
      const context: TriggerContext = {
        userId: trigger.userId,
        timestamp: new Date()
      }

      let shouldTrigger = false

      switch (condition.type) {
        case 'time':
          shouldTrigger = await this.evaluateTimeCondition(condition, context)
          break
        case 'milestone':
          shouldTrigger = await this.evaluateMilestoneCondition(condition, context)
          break
        case 'metric':
          shouldTrigger = await this.evaluateMetricCondition(condition, context)
          break
        case 'external':
          shouldTrigger = await this.evaluateExternalCondition(condition, context)
          break
      }

      if (shouldTrigger) {
        await this.executeTriggerAction(trigger, context)
      }
    } catch (error) {
      console.error(`Error evaluating trigger ${trigger._id}:`, error)
    }
  }

  // Evaluate time-based conditions
  private async evaluateTimeCondition(condition: any, context: TriggerContext): Promise<boolean> {
    const now = new Date()
    const targetTime = new Date(condition.value)
    
    switch (condition.operator) {
      case 'equals':
        return Math.abs(now.getTime() - targetTime.getTime()) < 60000 // Within 1 minute
      case 'greater_than':
        return now > targetTime
      case 'less_than':
        return now < targetTime
      default:
        return false
    }
  }

  // Evaluate milestone-based conditions
  private async evaluateMilestoneCondition(condition: any, context: TriggerContext): Promise<boolean> {
    try {
      const db = await realtimeDB['db']
      const milestone = await db.collection('milestones').findOne({ 
        _id: new ObjectId(condition.value),
        userId: context.userId 
      })

      if (!milestone) return false

      switch (condition.operator) {
        case 'equals':
          return milestone.status === condition.value
        case 'greater_than':
          return new Date(milestone.targetDate) > new Date(condition.value)
        case 'less_than':
          return new Date(milestone.targetDate) < new Date(condition.value)
        default:
          return false
      }
    } catch (error) {
      console.error('Error evaluating milestone condition:', error)
      return false
    }
  }

  // Evaluate metric-based conditions
  private async evaluateMetricCondition(condition: any, context: TriggerContext): Promise<boolean> {
    try {
      const db = await realtimeDB['db']
      const metrics = await db.collection('project_metrics')
        .find({ userId: context.userId })
        .sort({ timestamp: -1 })
        .limit(1)
        .toArray()

      if (metrics.length === 0) return false

      const latestMetric = metrics[0]
      const metricValue = latestMetric.value
      const targetValue = parseFloat(condition.value)

      switch (condition.operator) {
        case 'equals':
          return Math.abs(metricValue - targetValue) < 0.01
        case 'greater_than':
          return metricValue > targetValue
        case 'less_than':
          return metricValue < targetValue
        default:
          return false
      }
    } catch (error) {
      console.error('Error evaluating metric condition:', error)
      return false
    }
  }

  // Evaluate external conditions (webhooks, API calls, etc.)
  private async evaluateExternalCondition(condition: any, context: TriggerContext): Promise<boolean> {
    // This would integrate with external services
    // For now, return false as a placeholder
    return false
  }

  // Execute trigger action
  private async executeTriggerAction(trigger: any, context: TriggerContext) {
    try {
      const action = trigger.action

      switch (action.type) {
        case 'notification':
          await this.createNotification({
            userId: context.userId,
            title: `Trigger: ${trigger.name}`,
            message: trigger.description,
            type: 'trigger',
            priority: 'medium',
            metadata: { triggerId: trigger._id, context }
          })
          break

        case 'task_creation':
          await this.createTaskFromTrigger(trigger, context)
          break

        case 'email':
          await this.sendEmailNotification(trigger, context)
          break

        case 'slack':
          await this.sendSlackNotification(trigger, context)
          break

        case 'calendar':
          await this.createCalendarEvent(trigger, context)
          break
      }
    } catch (error) {
      console.error('Error executing trigger action:', error)
    }
  }

  // Create a notification
  public async createNotification(notificationData: Omit<Notification, 'id' | 'createdAt'>) {
    try {
      const db = await realtimeDB['db']
      const notification = {
        ...notificationData,
        isRead: false,
        createdAt: new Date()
      }

      const result = await db.collection('notifications').insertOne(notification)
      return result.insertedId
    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    }
  }

  // Create task from trigger
  private async createTaskFromTrigger(trigger: any, context: TriggerContext) {
    try {
      const db = await realtimeDB['db']
      const task = {
        title: `Auto-generated: ${trigger.name}`,
        description: trigger.description,
        userId: context.userId,
        priority: 'medium',
        status: 'pending',
        createdAt: new Date(),
        metadata: { triggerId: trigger._id }
      }

      await db.collection('ceo_tasks').insertOne(task)
    } catch (error) {
      console.error('Error creating task from trigger:', error)
    }
  }

  // Send email notification
  private async sendEmailNotification(trigger: any, context: TriggerContext) {
    // This would integrate with an email service like SendGrid, AWS SES, etc.
    console.log('Email notification would be sent:', trigger.name)
  }

  // Send Slack notification
  private async sendSlackNotification(trigger: any, context: TriggerContext) {
    // This would integrate with Slack API
    console.log('Slack notification would be sent:', trigger.name)
  }

  // Create calendar event
  private async createCalendarEvent(trigger: any, context: TriggerContext) {
    // This would integrate with calendar APIs
    console.log('Calendar event would be created:', trigger.name)
  }

  // Get notifications for a user
  public async getUserNotifications(userId: string, limit: number = 50) {
    try {
      const db = await realtimeDB['db']
      const notifications = await db.collection('notifications')
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray()

      return notifications
    } catch (error) {
      console.error('Error fetching notifications:', error)
      return []
    }
  }

  // Mark notification as read
  public async markNotificationAsRead(notificationId: string) {
    try {
      const db = await realtimeDB['db']
      await db.collection('notifications').updateOne(
        { _id: new ObjectId(notificationId) },
        { $set: { isRead: true } }
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Clean up expired notifications
  public async cleanupExpiredNotifications() {
    try {
      const db = await realtimeDB['db']
      const now = new Date()
      
      await db.collection('notifications').deleteMany({
        expiresAt: { $lt: now }
      })
    } catch (error) {
      console.error('Error cleaning up expired notifications:', error)
    }
  }

  // Stop monitoring
  public stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }
  }
}

// Export singleton instance
export const notificationSystem = NotificationSystem.getInstance()

// React hook for notifications
export function useNotifications(userId: string) {
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true)
        setError(null)
        const userNotifications = await notificationSystem.getUserNotifications(userId)
        setNotifications(userNotifications)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      loadNotifications()
    }
  }, [userId])

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationSystem.markNotificationAsRead(notificationId)
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  return { notifications, loading, error, markAsRead }
}
