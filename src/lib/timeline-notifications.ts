import { ObjectId } from 'mongodb'

export interface TimelineEvent {
  id: string
  type: 'routine' | 'milestone' | 'task' | 'meeting' | 'break' | 'focus'
  title: string
  description: string
  startTime: Date
  endTime?: Date
  priority: 'low' | 'medium' | 'high' | 'critical'
  isRecurring: boolean
  recurrencePattern?: 'daily' | 'weekly' | 'monthly'
  metadata?: Record<string, any>
}

export interface TimelineNotification {
  id: string
  eventId: string
  type: 'reminder' | 'start' | 'end' | 'overdue'
  title: string
  message: string
  scheduledTime: Date
  isSent: boolean
  userId: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  actionUrl?: string
}

export class TimelineNotificationSystem {
  private static instance: TimelineNotificationSystem
  private events: Map<string, TimelineEvent> = new Map()
  private notifications: Map<string, TimelineNotification> = new Map()
  private intervalId: NodeJS.Timeout | null = null

  private constructor() {
    this.startTimelineMonitoring()
  }

  public static getInstance(): TimelineNotificationSystem {
    if (!TimelineNotificationSystem.instance) {
      TimelineNotificationSystem.instance = new TimelineNotificationSystem()
    }
    return TimelineNotificationSystem.instance
  }

  // Start monitoring timeline events
  private startTimelineMonitoring() {
    // Check for timeline events every minute
    this.intervalId = setInterval(() => {
      this.checkTimelineEvents()
    }, 60000)
  }

  // Check for timeline events that need notifications
  private checkTimelineEvents() {
    const now = new Date()
    
    for (const event of this.events.values()) {
      // Check for reminder notifications (15 minutes before)
      const reminderTime = new Date(event.startTime.getTime() - 15 * 60 * 1000)
      if (now >= reminderTime && now < event.startTime) {
        this.createNotification({
          eventId: event.id,
          type: 'reminder',
          title: `Reminder: ${event.title}`,
          message: `${event.description} starts in 15 minutes.`,
          scheduledTime: reminderTime,
          priority: event.priority,
          actionUrl: `/timeline/${event.id}`
        })
      }

      // Check for start notifications
      if (now >= event.startTime && now < new Date(event.startTime.getTime() + 5 * 60 * 1000)) {
        this.createNotification({
          eventId: event.id,
          type: 'start',
          title: `Starting: ${event.title}`,
          message: `It's time for ${event.title}. ${event.description}`,
          scheduledTime: event.startTime,
          priority: event.priority,
          actionUrl: `/timeline/${event.id}`
        })
      }

      // Check for end notifications
      if (event.endTime && now >= event.endTime && now < new Date(event.endTime.getTime() + 5 * 60 * 1000)) {
        this.createNotification({
          eventId: event.id,
          type: 'end',
          title: `Completed: ${event.title}`,
          message: `${event.title} has ended. Time to transition to your next task.`,
          scheduledTime: event.endTime,
          priority: 'low',
          actionUrl: `/timeline/${event.id}`
        })
      }

      // Check for overdue notifications
      if (now > event.startTime && !event.isRecurring) {
        this.createNotification({
          eventId: event.id,
          type: 'overdue',
          title: `Overdue: ${event.title}`,
          message: `${event.title} was scheduled to start but hasn't been marked as started.`,
          scheduledTime: now,
          priority: 'high',
          actionUrl: `/timeline/${event.id}`
        })
      }
    }
  }

  // Create a timeline event
  public createEvent(event: Omit<TimelineEvent, 'id'>): string {
    const id = new ObjectId().toString()
    const timelineEvent: TimelineEvent = {
      ...event,
      id
    }
    
    this.events.set(id, timelineEvent)
    return id
  }

  // Create a notification
  private createNotification(notification: Omit<TimelineNotification, 'id' | 'userId' | 'isSent'>): string {
    const id = new ObjectId().toString()
    const timelineNotification: TimelineNotification = {
      ...notification,
      id,
      userId: 'current-user-id', // This would come from auth context
      isSent: false
    }
    
    this.notifications.set(id, timelineNotification)
    return id
  }

  // Get upcoming events for a user
  public getUpcomingEvents(userId: string, hours: number = 24): TimelineEvent[] {
    const now = new Date()
    const endTime = new Date(now.getTime() + hours * 60 * 60 * 1000)
    
    return Array.from(this.events.values())
      .filter(event => event.startTime >= now && event.startTime <= endTime)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
  }

  // Get pending notifications for a user
  public getPendingNotifications(userId: string): TimelineNotification[] {
    const now = new Date()
    
    return Array.from(this.notifications.values())
      .filter(notification => 
        notification.userId === userId && 
        !notification.isSent && 
        notification.scheduledTime <= now
      )
      .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime())
  }

  // Mark notification as sent
  public markNotificationAsSent(notificationId: string): void {
    const notification = this.notifications.get(notificationId)
    if (notification) {
      notification.isSent = true
      this.notifications.set(notificationId, notification)
    }
  }

  // Generate routine events for a day
  public generateDailyRoutine(date: Date): TimelineEvent[] {
    const events: TimelineEvent[] = []
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()

    // Morning routine
    events.push({
      id: new ObjectId().toString(),
      type: 'routine',
      title: 'Morning Routine',
      description: 'Review daily priorities and plan your day',
      startTime: new Date(year, month, day, 8, 0),
      endTime: new Date(year, month, day, 8, 30),
      priority: 'medium',
      isRecurring: true,
      recurrencePattern: 'daily'
    })

    // Focus block 1
    events.push({
      id: new ObjectId().toString(),
      type: 'focus',
      title: 'Deep Work Session 1',
      description: 'Focus on your most important task without distractions',
      startTime: new Date(year, month, day, 9, 0),
      endTime: new Date(year, month, day, 11, 0),
      priority: 'high',
      isRecurring: true,
      recurrencePattern: 'daily'
    })

    // Mid-morning break
    events.push({
      id: new ObjectId().toString(),
      type: 'break',
      title: 'Mid-Morning Break',
      description: 'Take a short break to recharge',
      startTime: new Date(year, month, day, 11, 0),
      endTime: new Date(year, month, day, 11, 15),
      priority: 'low',
      isRecurring: true,
      recurrencePattern: 'daily'
    })

    // Focus block 2
    events.push({
      id: new ObjectId().toString(),
      type: 'focus',
      title: 'Deep Work Session 2',
      description: 'Continue with important tasks or start new ones',
      startTime: new Date(year, month, day, 11, 15),
      endTime: new Date(year, month, day, 12, 0),
      priority: 'high',
      isRecurring: true,
      recurrencePattern: 'daily'
    })

    // Lunch break
    events.push({
      id: new ObjectId().toString(),
      type: 'break',
      title: 'Lunch Break',
      description: 'Take a proper lunch break to refuel',
      startTime: new Date(year, month, day, 12, 0),
      endTime: new Date(year, month, day, 13, 0),
      priority: 'medium',
      isRecurring: true,
      recurrencePattern: 'daily'
    })

    // Afternoon focus
    events.push({
      id: new ObjectId().toString(),
      type: 'focus',
      title: 'Afternoon Focus',
      description: 'Tackle remaining tasks and meetings',
      startTime: new Date(year, month, day, 13, 0),
      endTime: new Date(year, month, day, 15, 0),
      priority: 'medium',
      isRecurring: true,
      recurrencePattern: 'daily'
    })

    // Afternoon break
    events.push({
      id: new ObjectId().toString(),
      type: 'break',
      title: 'Afternoon Break',
      description: 'Take a break to maintain energy',
      startTime: new Date(year, month, day, 15, 0),
      endTime: new Date(year, month, day, 15, 15),
      priority: 'low',
      isRecurring: true,
      recurrencePattern: 'daily'
    })

    // End of day review
    events.push({
      id: new ObjectId().toString(),
      type: 'routine',
      title: 'End of Day Review',
      description: 'Review accomplishments and plan tomorrow',
      startTime: new Date(year, month, day, 17, 0),
      endTime: new Date(year, month, day, 17, 30),
      priority: 'medium',
      isRecurring: true,
      recurrencePattern: 'daily'
    })

    // Add events to the system
    events.forEach(event => {
      this.events.set(event.id, event)
    })

    return events
  }

  // Get current focus session
  public getCurrentFocusSession(): TimelineEvent | null {
    const now = new Date()
    
    for (const event of this.events.values()) {
      if (event.type === 'focus' && 
          now >= event.startTime && 
          (!event.endTime || now <= event.endTime)) {
        return event
      }
    }
    
    return null
  }

  // Get next break
  public getNextBreak(): TimelineEvent | null {
    const now = new Date()
    
    const upcomingBreaks = Array.from(this.events.values())
      .filter(event => event.type === 'break' && event.startTime > now)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    
    return upcomingBreaks[0] || null
  }

  // Stop monitoring
  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }
}

// Export singleton instance
export const timelineNotificationSystem = TimelineNotificationSystem.getInstance()

// React hook for timeline notifications
export function useTimelineNotifications(userId: string) {
  const [events, setEvents] = React.useState<TimelineEvent[]>([])
  const [notifications, setNotifications] = React.useState<TimelineNotification[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const loadTimelineData = () => {
      try {
        setLoading(true)
        
        // Generate daily routine if not exists
        const today = new Date()
        const upcomingEvents = timelineNotificationSystem.getUpcomingEvents(userId, 24)
        
        if (upcomingEvents.length === 0) {
          timelineNotificationSystem.generateDailyRoutine(today)
        }
        
        const newEvents = timelineNotificationSystem.getUpcomingEvents(userId, 24)
        const newNotifications = timelineNotificationSystem.getPendingNotifications(userId)
        
        setEvents(newEvents)
        setNotifications(newNotifications)
      } catch (error) {
        console.error('Error loading timeline data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTimelineData()
    
    // Refresh every minute
    const interval = setInterval(loadTimelineData, 60000)
    
    return () => clearInterval(interval)
  }, [userId])

  const markNotificationAsSent = (notificationId: string) => {
    timelineNotificationSystem.markNotificationAsSent(notificationId)
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }

  return { events, notifications, loading, markNotificationAsSent }
}
