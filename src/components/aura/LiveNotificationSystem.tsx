'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BellIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
  PlayIcon,
  PauseIcon,
  CalendarIcon,
  UserIcon,
  ChartBarIcon,
  TargetIcon,
  FlagIcon,
  CogIcon,
} from '@heroicons/react/24/outline'
import { useNotifications } from '@/lib/notification-system'

interface NotificationCard {
  id: string
  type: 'routine' | 'milestone' | 'task' | 'system' | 'reminder'
  priority: 'low' | 'medium' | 'high' | 'critical'
  title: string
  message: string
  timestamp: Date
  actionUrl?: string
  autoClose?: boolean
  duration?: number
  metadata?: Record<string, any>
}

interface LiveNotificationSystemProps {
  userId: string
  isActive: boolean
  onNotificationAction?: (notification: NotificationCard) => void
}

export default function LiveNotificationSystem({ 
  userId, 
  isActive, 
  onNotificationAction 
}: LiveNotificationSystemProps) {
  const [notifications, setNotifications] = useState<NotificationCard[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const [settings, setSettings] = useState({
    showRoutine: true,
    showMilestones: true,
    showTasks: true,
    showSystem: true,
    autoClose: true,
    soundEnabled: true,
    vibrationEnabled: true
  })
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const soundRef = useRef<HTMLAudioElement | null>(null)

  // Load notifications from the notification system
  const { notifications: systemNotifications, markAsRead } = useNotifications(userId)

  // Initialize sound
  useEffect(() => {
    soundRef.current = new Audio('/sounds/notification.mp3')
    soundRef.current.volume = 0.3
  }, [])

  // Generate routine notifications based on time
  useEffect(() => {
    if (!isActive || isPaused) return

    const generateRoutineNotifications = () => {
      const now = new Date()
      const hour = now.getHours()
      const minute = now.getMinutes()
      
      const routineNotifications: NotificationCard[] = []

      // Morning routine (8:00 AM)
      if (hour === 8 && minute === 0) {
        routineNotifications.push({
          id: `routine-morning-${now.getTime()}`,
          type: 'routine',
          priority: 'medium',
          title: 'Good Morning! 🌅',
          message: 'Time to review your daily priorities and start your focus blocks.',
          timestamp: now,
          autoClose: true,
          duration: 10000,
          metadata: { routine: 'morning' }
        })
      }

      // Mid-morning check (10:30 AM)
      if (hour === 10 && minute === 30) {
        routineNotifications.push({
          id: `routine-midmorning-${now.getTime()}`,
          type: 'routine',
          priority: 'low',
          title: 'Mid-Morning Check-in 📊',
          message: 'How are your morning tasks progressing? Time for a quick review.',
          timestamp: now,
          autoClose: true,
          duration: 8000,
          metadata: { routine: 'midmorning' }
        })
      }

      // Lunch break reminder (12:00 PM)
      if (hour === 12 && minute === 0) {
        routineNotifications.push({
          id: `routine-lunch-${now.getTime()}`,
          type: 'routine',
          priority: 'low',
          title: 'Lunch Break Time! 🍽️',
          message: 'Take a well-deserved break. Your brain needs fuel to stay sharp.',
          timestamp: now,
          autoClose: true,
          duration: 12000,
          metadata: { routine: 'lunch' }
        })
      }

      // Afternoon focus (2:00 PM)
      if (hour === 14 && minute === 0) {
        routineNotifications.push({
          id: `routine-afternoon-${now.getTime()}`,
          type: 'routine',
          priority: 'medium',
          title: 'Afternoon Focus Session 🎯',
          message: 'Time for deep work. Close distractions and focus on your most important task.',
          timestamp: now,
          autoClose: true,
          duration: 10000,
          metadata: { routine: 'afternoon' }
        })
      }

      // End of day review (5:00 PM)
      if (hour === 17 && minute === 0) {
        routineNotifications.push({
          id: `routine-eod-${now.getTime()}`,
          type: 'routine',
          priority: 'medium',
          title: 'End of Day Review 📝',
          message: 'Time to review your accomplishments and plan tomorrow\'s priorities.',
          timestamp: now,
          autoClose: false,
          metadata: { routine: 'eod' }
        })
      }

      // Evening wind-down (7:00 PM)
      if (hour === 19 && minute === 0) {
        routineNotifications.push({
          id: `routine-evening-${now.getTime()}`,
          type: 'routine',
          priority: 'low',
          title: 'Evening Wind-down 🌙',
          message: 'Time to transition from work mode. Review your day and prepare for tomorrow.',
          timestamp: now,
          autoClose: true,
          duration: 15000,
          metadata: { routine: 'evening' }
        })
      }

      return routineNotifications
    }

    // Check for routine notifications every minute
    const checkRoutineNotifications = () => {
      const newNotifications = generateRoutineNotifications()
      if (newNotifications.length > 0) {
        setNotifications(prev => [...prev, ...newNotifications])
        
        // Play sound if enabled
        if (settings.soundEnabled && soundRef.current) {
          soundRef.current.play().catch(console.error)
        }
        
        // Vibrate if enabled and supported
        if (settings.vibrationEnabled && 'vibrate' in navigator) {
          navigator.vibrate([200, 100, 200])
        }
      }
    }

    // Initial check
    checkRoutineNotifications()

    // Set up interval for checking every minute
    intervalRef.current = setInterval(checkRoutineNotifications, 60000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, isPaused, settings.soundEnabled, settings.vibrationEnabled])

  // Convert system notifications to card format
  useEffect(() => {
    const cardNotifications: NotificationCard[] = systemNotifications.map(notif => ({
      id: notif.id,
      type: notif.type as any,
      priority: notif.priority as any,
      title: notif.title,
      message: notif.message,
      timestamp: notif.createdAt,
      actionUrl: notif.actionUrl,
      autoClose: notif.type === 'routine',
      duration: 8000,
      metadata: notif.metadata
    }))

    setNotifications(prev => {
      const existingIds = new Set(prev.map(n => n.id))
      const newCards = cardNotifications.filter(n => !existingIds.has(n.id))
      return [...prev, ...newCards]
    })
  }, [systemNotifications])

  // Auto-close notifications
  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.autoClose && notification.duration) {
        const timer = setTimeout(() => {
          removeNotification(notification.id)
        }, notification.duration)

        return () => clearTimeout(timer)
      }
    })
  }, [notifications])

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleNotificationAction = (notification: NotificationCard) => {
    onNotificationAction?.(notification)
    removeNotification(notification.id)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'routine': return ClockIcon
      case 'milestone': return FlagIcon
      case 'task': return TargetIcon
      case 'system': return CogIcon
      case 'reminder': return BellIcon
      default: return InformationCircleIcon
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-500/10'
      case 'high': return 'border-orange-500 bg-orange-500/10'
      case 'medium': return 'border-blue-500 bg-blue-500/10'
      case 'low': return 'border-green-500 bg-green-500/10'
      default: return 'border-gray-500 bg-gray-500/10'
    }
  }

  const getPriorityGlow = (priority: string) => {
    switch (priority) {
      case 'critical': return 'shadow-red-500/50'
      case 'high': return 'shadow-orange-500/50'
      case 'medium': return 'shadow-blue-500/50'
      case 'low': return 'shadow-green-500/50'
      default: return 'shadow-gray-500/50'
    }
  }

  if (!isActive) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {/* Control Panel */}
      <div className="aura-card p-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellIcon className="w-5 h-5 text-aura-accent-primary" />
            <span className="text-sm font-medium text-aura-text-primary">
              Live Assistant
            </span>
            <div className={`w-2 h-2 rounded-full ${
              isPaused ? 'bg-aura-status-warning' : 'bg-aura-status-success animate-pulse'
            }`}></div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 rounded-md hover:bg-aura-surface-elevated transition-colors"
            >
              {isPaused ? (
                <PlayIcon className="w-4 h-4 text-aura-text-secondary" />
              ) : (
                <PauseIcon className="w-4 h-4 text-aura-text-secondary" />
              )}
            </button>
            <button
              onClick={() => setNotifications([])}
              className="p-1.5 rounded-md hover:bg-aura-surface-elevated transition-colors"
            >
              <XMarkIcon className="w-4 h-4 text-aura-text-secondary" />
            </button>
          </div>
        </div>
      </div>

      {/* Notification Cards */}
      <AnimatePresence>
        {notifications.map((notification) => {
          const Icon = getNotificationIcon(notification.type)
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`aura-card p-4 border-l-4 ${getPriorityColor(notification.priority)} shadow-lg ${getPriorityGlow(notification.priority)}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="p-2 rounded-lg bg-aura-surface-elevated">
                    <Icon className="w-5 h-5 text-aura-accent-primary" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-aura-text-primary text-sm">
                      {notification.title}
                    </h4>
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="p-1 rounded-md hover:bg-aura-surface-elevated transition-colors"
                    >
                      <XMarkIcon className="w-3 h-3 text-aura-text-muted" />
                    </button>
                  </div>
                  
                  <p className="text-aura-text-secondary text-sm mb-2">
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-aura-text-muted">
                      {notification.timestamp.toLocaleTimeString()}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <span className={`aura-badge ${
                        notification.priority === 'critical' ? 'aura-badge-danger' :
                        notification.priority === 'high' ? 'aura-badge-warning' :
                        notification.priority === 'medium' ? 'aura-badge-primary' :
                        'aura-badge-success'
                      }`}>
                        {notification.priority}
                      </span>
                      
                      {notification.actionUrl && (
                        <button
                          onClick={() => handleNotificationAction(notification)}
                          className="aura-button aura-button-primary text-xs px-2 py-1"
                        >
                          View
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>

      {/* Empty State */}
      {notifications.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="aura-card p-6 text-center"
        >
          <BellIcon className="w-8 h-8 text-aura-text-muted mx-auto mb-2" />
          <p className="text-aura-text-secondary text-sm">
            {isPaused ? 'Notifications paused' : 'No notifications at the moment'}
          </p>
        </motion.div>
      )}
    </div>
  )
}
