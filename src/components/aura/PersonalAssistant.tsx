'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SparklesIcon,
  LightBulbIcon,
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserIcon,
  CalendarIcon,
  TargetIcon,
  FlagIcon,
  CogIcon,
  BellIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline'
import { useRealtimeData } from '@/lib/realtime-mongodb'

interface AssistantInsight {
  id: string
  type: 'productivity' | 'health' | 'opportunity' | 'warning' | 'achievement'
  title: string
  message: string
  confidence: number
  action?: {
    label: string
    url: string
  }
  timestamp: Date
  priority: 'low' | 'medium' | 'high' | 'critical'
}

interface PersonalAssistantProps {
  userId: string
  isVisible: boolean
  onToggle: () => void
}

export default function PersonalAssistant({ 
  userId, 
  isVisible, 
  onToggle 
}: PersonalAssistantProps) {
  const [insights, setInsights] = useState<AssistantInsight[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [settings, setSettings] = useState({
    showProductivity: true,
    showHealth: true,
    showOpportunities: true,
    showWarnings: true,
    showAchievements: true,
    autoAnalyze: true,
    analysisInterval: 300000 // 5 minutes
  })

  // Real-time data
  const { data: milestones } = useRealtimeData('milestones', { userId })
  const { data: tasks } = useRealtimeData('ceo_tasks', { userId })
  const { data: metrics } = useRealtimeData('project_metrics', { userId })

  // Generate insights based on data patterns
  useEffect(() => {
    if (!settings.autoAnalyze) return

    const generateInsights = () => {
      setIsAnalyzing(true)
      const newInsights: AssistantInsight[] = []

      // Analyze milestone progress
      const upcomingMilestones = milestones.filter(m => 
        new Date(m.targetDate) > new Date() && 
        new Date(m.targetDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      )

      if (upcomingMilestones.length > 0) {
        newInsights.push({
          id: `milestone-${Date.now()}`,
          type: 'warning',
          title: 'Upcoming Milestones',
          message: `You have ${upcomingMilestones.length} milestone(s) due within the next week. Consider reviewing your priorities.`,
          confidence: 0.9,
          action: {
            label: 'Review Milestones',
            url: '/milestones'
          },
          timestamp: new Date(),
          priority: 'high'
        })
      }

      // Analyze task completion patterns
      const completedTasks = tasks.filter(t => t.status === 'completed')
      const totalTasks = tasks.length
      const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0

      if (completionRate > 80) {
        newInsights.push({
          id: `achievement-${Date.now()}`,
          type: 'achievement',
          title: 'Excellent Productivity!',
          message: `You've completed ${completionRate.toFixed(1)}% of your tasks. Keep up the great work!`,
          confidence: 0.95,
          timestamp: new Date(),
          priority: 'medium'
        })
      } else if (completionRate < 50) {
        newInsights.push({
          id: `warning-${Date.now()}`,
          type: 'warning',
          title: 'Task Completion Alert',
          message: `Your task completion rate is ${completionRate.toFixed(1)}%. Consider breaking down large tasks or adjusting priorities.`,
          confidence: 0.8,
          action: {
            label: 'Review Tasks',
            url: '/tasks'
          },
          timestamp: new Date(),
          priority: 'high'
        })
      }

      // Analyze focus patterns
      const currentHour = new Date().getHours()
      if (currentHour >= 9 && currentHour <= 11) {
        newInsights.push({
          id: `focus-${Date.now()}`,
          type: 'productivity',
          title: 'Peak Focus Time',
          message: 'You\'re in your peak focus hours (9-11 AM). This is the best time for deep work and complex tasks.',
          confidence: 0.85,
          timestamp: new Date(),
          priority: 'medium'
        })
      }

      // Analyze system health
      const criticalMetrics = metrics.filter(m => m.value < 0.8)
      if (criticalMetrics.length > 0) {
        newInsights.push({
          id: `system-${Date.now()}`,
          type: 'warning',
          title: 'System Health Alert',
          message: `${criticalMetrics.length} system metric(s) are below optimal thresholds. Consider investigating.`,
          confidence: 0.9,
          action: {
            label: 'View Metrics',
            url: '/metrics'
          },
          timestamp: new Date(),
          priority: 'critical'
        })
      }

      // Analyze opportunities
      const overdueTasks = tasks.filter(t => 
        t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
      )

      if (overdueTasks.length === 0 && tasks.length > 5) {
        newInsights.push({
          id: `opportunity-${Date.now()}`,
          type: 'opportunity',
          title: 'Capacity Available',
          message: 'You\'re caught up on all tasks! This is a great time to tackle new projects or focus on strategic planning.',
          confidence: 0.8,
          timestamp: new Date(),
          priority: 'low'
        })
      }

      // Analyze work-life balance
      const currentDay = new Date().getDay()
      const currentHour = new Date().getHours()
      
      if (currentDay === 5 && currentHour >= 17) { // Friday after 5 PM
        newInsights.push({
          id: `balance-${Date.now()}`,
          type: 'health',
          title: 'Weekend Approaching',
          message: 'Great job this week! Time to wind down and prepare for a restful weekend.',
          confidence: 0.9,
          timestamp: new Date(),
          priority: 'low'
        })
      }

      setInsights(prev => {
        const existingIds = new Set(prev.map(i => i.id))
        const newInsightsFiltered = newInsights.filter(i => !existingIds.has(i.id))
        return [...prev, ...newInsightsFiltered].slice(-10) // Keep only last 10 insights
      })

      setIsAnalyzing(false)
    }

    // Initial analysis
    generateInsights()

    // Set up interval for periodic analysis
    const interval = setInterval(generateInsights, settings.analysisInterval)

    return () => clearInterval(interval)
  }, [milestones, tasks, metrics, settings.autoAnalyze, settings.analysisInterval])

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'productivity': return ChartBarIcon
      case 'health': return UserIcon
      case 'opportunity': return LightBulbIcon
      case 'warning': return ExclamationTriangleIcon
      case 'achievement': return CheckCircleIcon
      default: return SparklesIcon
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'productivity': return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
      case 'health': return 'text-green-500 bg-green-500/10 border-green-500/20'
      case 'opportunity': return 'text-purple-500 bg-purple-500/10 border-purple-500/20'
      case 'warning': return 'text-orange-500 bg-orange-500/10 border-orange-500/20'
      case 'achievement': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return ArrowTrendingUpIcon
      case 'high': return ExclamationTriangleIcon
      case 'medium': return ClockIcon
      case 'low': return CheckCircleIcon
      default: return InformationCircleIcon
    }
  }

  const dismissInsight = (id: string) => {
    setInsights(prev => prev.filter(i => i.id !== id))
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="aura-card p-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-aura-accent-primary" />
            <h3 className="font-semibold text-aura-text-primary">AI Assistant</h3>
            {isAnalyzing && (
              <div className="w-2 h-2 bg-aura-accent-primary rounded-full animate-pulse"></div>
            )}
          </div>
          <button
            onClick={onToggle}
            className="p-1 rounded-md hover:bg-aura-surface-elevated transition-colors"
          >
            <EyeSlashIcon className="w-4 h-4 text-aura-text-secondary" />
          </button>
        </div>

        {/* Insights */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {insights.map((insight) => {
              const Icon = getInsightIcon(insight.type)
              const PriorityIcon = getPriorityIcon(insight.priority)
              
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`p-3 rounded-lg border-l-4 ${getInsightColor(insight.type)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="p-2 rounded-lg bg-aura-surface-elevated">
                        <Icon className="w-4 h-4 text-aura-accent-primary" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-aura-text-primary text-sm">
                          {insight.title}
                        </h4>
                        <div className="flex items-center gap-1">
                          <PriorityIcon className="w-3 h-3 text-aura-text-muted" />
                          <button
                            onClick={() => dismissInsight(insight.id)}
                            className="p-1 rounded hover:bg-aura-surface-elevated transition-colors"
                          >
                            <XMarkIcon className="w-3 h-3 text-aura-text-muted" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-aura-text-secondary text-xs mb-2">
                        {insight.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-aura-text-muted">
                            {Math.round(insight.confidence * 100)}% confidence
                          </span>
                          <span className="text-xs text-aura-text-muted">
                            {insight.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        
                        {insight.action && (
                          <button
                            onClick={() => window.open(insight.action!.url, '_blank')}
                            className="aura-button aura-button-primary text-xs px-2 py-1"
                          >
                            {insight.action.label}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {insights.length === 0 && !isAnalyzing && (
          <div className="text-center py-6">
            <SparklesIcon className="w-8 h-8 text-aura-text-muted mx-auto mb-2" />
            <p className="text-aura-text-secondary text-sm">
              Analyzing your data patterns...
            </p>
          </div>
        )}

        {/* Settings */}
        <div className="mt-4 pt-4 border-t border-aura-glass-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-aura-text-secondary">Auto-analyze</span>
            <button
              onClick={() => setSettings(prev => ({ ...prev, autoAnalyze: !prev.autoAnalyze }))}
              className={`w-8 h-4 rounded-full transition-colors ${
                settings.autoAnalyze ? 'bg-aura-accent-primary' : 'bg-aura-surface-elevated'
              }`}
            >
              <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                settings.autoAnalyze ? 'translate-x-4' : 'translate-x-0.5'
              }`}></div>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
