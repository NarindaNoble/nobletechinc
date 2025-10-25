'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  HomeIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  CalendarIcon,
  UserGroupIcon,
  CogIcon,
  EyeIcon,
  ArrowRightIcon,
  TargetIcon,
  FlagIcon,
} from '@heroicons/react/24/outline'
import MilestoneTriggerSystem from '@/components/aura/MilestoneTriggerSystem'
import AuraNavigation from '@/components/AuraNavigation'
import { useRealtimeData } from '@/lib/realtime-mongodb'
import { useNotifications } from '@/lib/notification-system'

interface CEOData {
  kpis: {
    activeProjects: number
    pipelineValue: number
    clientHealth: number
    teamCapacity: number
  }
  tasks: Array<{
    id: string
    title: string
    due: string
    priority: string
    status: string
  }>
  communications: Array<{
    id: string
    type: string
    title: string
    from: string
    urgency: string
    timestamp: string
  }>
}

export default function AEDCommand() {
  const [location, setLocation] = useState<'HOME' | 'OFFICE'>('HOME')
  const [showMilestoneSystem, setShowMilestoneSystem] = useState(false)
  const [ceoData, setCeoData] = useState<CEOData | null>(null)
  const [loading, setLoading] = useState(true)

  // Real-time data from MongoDB
  const { data: milestones } = useRealtimeData('milestones', { userId: 'current-user-id' })
  const { data: triggers } = useRealtimeData('triggers', { userId: 'current-user-id' })
  const { data: tasks } = useRealtimeData('ceo_tasks', { userId: 'current-user-id' })
  const { notifications } = useNotifications('current-user-id')

  // Load CEO data from real sources
  useEffect(() => {
    const loadCEOData = async () => {
      try {
        setLoading(true)
        
        // Load real data from APIs
        const [kpisResponse, tasksResponse, commsResponse] = await Promise.all([
          fetch('/api/ceo/kpis'),
          fetch('/api/ceo/tasks'),
          fetch('/api/ceo/communications')
        ])

        const kpis = await kpisResponse.json()
        const tasksData = await tasksResponse.json()
        const comms = await commsResponse.json()

        setCeoData({
          kpis: kpis.data || { activeProjects: 0, pipelineValue: 0, clientHealth: 0, teamCapacity: 0 },
          tasks: tasksData.data || [],
          communications: comms.data || []
        })
      } catch (error) {
        console.error('Error loading CEO data:', error)
        // Fallback to empty data
        setCeoData({
          kpis: { activeProjects: 0, pipelineValue: 0, clientHealth: 0, teamCapacity: 0 },
          tasks: [],
          communications: []
        })
      } finally {
        setLoading(false)
      }
    }

    loadCEOData()
  }, [])

  const homeModeData = [
    { icon: ClockIcon, label: 'Virtual Meetings', value: `${ceoData?.kpis.activeProjects || 0} scheduled today` },
    { icon: ChartBarIcon, label: 'Focus Blocks', value: '2 hours available' },
    { icon: CheckCircleIcon, label: 'Deep Work', value: 'Strategic planning' },
  ]

  const officeModeData = [
    { icon: BuildingOfficeIcon, label: 'In-Person Meetings', value: '2 scheduled today' },
    { icon: UserGroupIcon, label: 'Team in Office', value: '8 people' },
    { icon: ChartBarIcon, label: 'Company KPIs', value: 'All systems green' },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-[var(--aura-accent-danger)] text-white'
      case 'HIGH': return 'bg-[var(--aura-accent-warning)] text-white'
      case 'MEDIUM': return 'bg-[var(--aura-accent-primary)] text-white'
      case 'LOW': return 'bg-[var(--aura-accent-success)] text-white'
      default: return 'bg-[var(--aura-accent-primary)] text-white'
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'HIGH': return 'bg-[var(--aura-accent-danger)]'
      case 'MEDIUM': return 'bg-[var(--aura-accent-warning)]'
      case 'LOW': return 'bg-[var(--aura-accent-success)]'
      default: return 'bg-[var(--aura-accent-primary)]'
    }
  }

  if (showMilestoneSystem) {
    return (
      <MilestoneTriggerSystem 
        userId="current-user-id"
        onMilestoneUpdate={(milestone) => {
          console.log('Milestone updated:', milestone)
        }}
        onTriggerUpdate={(trigger) => {
          console.log('Trigger updated:', trigger)
        }}
      />
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen aura-theme aura-tech-grid flex items-center justify-center">
        <div className="text-center">
          <div className="aura-spinner mx-auto mb-4"></div>
          <p className="text-[var(--aura-text-secondary)]">Loading CEO Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen aura-theme aura-tech-grid">
      {/* AED Navigation Header */}
      <nav className="bg-[var(--aura-surface)] border-b border-[var(--aura-accent-secondary)]/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[var(--aura-accent-secondary)] to-[var(--aura-accent-primary)] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-[var(--aura-text-primary)]">Aura Executive Dynamics</h1>
                <p className="text-sm text-[var(--aura-text-secondary)]">CEO Command Center</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowMilestoneSystem(true)}
                className="aura-btn aura-btn-secondary flex items-center gap-2"
              >
                <TargetIcon className="w-4 h-4" />
                Milestones & Triggers
              </button>
              <div className="flex items-center gap-2 text-sm text-[var(--aura-text-secondary)]">
                <BellIcon className="w-4 h-4" />
                {notifications.filter(n => !n.isRead).length} notifications
              </div>
              <div className="text-sm text-[var(--aura-text-secondary)]">
                Welcome, <span className="text-[var(--aura-accent-secondary)]">Noble</span>
              </div>
              <div className="w-8 h-8 bg-[var(--aura-accent-secondary)] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">N</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[var(--aura-text-primary)] mb-2">
                Aura Executive Dynamics
              </h1>
              <p className="text-[var(--aura-text-secondary)]">
                AI-powered executive command center
              </p>
            </div>
            
            {/* Location Toggle */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-[var(--aura-text-secondary)]">Context:</span>
              <div className="flex bg-[var(--aura-surface)] rounded-lg p-1">
                <button
                  onClick={() => setLocation('HOME')}
                  className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-colors ${
                    location === 'HOME' 
                      ? 'bg-[var(--aura-accent-primary)] text-[var(--aura-text-inverse)]' 
                      : 'text-[var(--aura-text-secondary)] hover:text-[var(--aura-text-primary)]'
                  }`}
                >
                  <HomeIcon className="w-4 h-4" />
                  <span>Home</span>
                </button>
                <button
                  onClick={() => setLocation('OFFICE')}
                  className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-colors ${
                    location === 'OFFICE' 
                      ? 'bg-[var(--aura-accent-primary)] text-[var(--aura-text-inverse)]' 
                      : 'text-[var(--aura-text-secondary)] hover:text-[var(--aura-text-primary)]'
                  }`}
                >
                  <BuildingOfficeIcon className="w-4 h-4" />
                  <span>Office</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Context-Aware Briefing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          {location === 'HOME' ? (
            <div className="aura-card">
              <h2 className="aura-chart-title mb-4">🏠 Home Mode - Deep Work Focus</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {homeModeData.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div key={index} className="text-center">
                      <Icon className="w-8 h-8 text-[var(--aura-accent-primary)] mx-auto mb-2" />
                      <h3 className="font-semibold mb-2">{item.label}</h3>
                      <p className="text-sm text-[var(--aura-text-secondary)]">{item.value}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="aura-card">
              <h2 className="aura-chart-title mb-4">🏢 Office Mode - Leadership & Collaboration</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {officeModeData.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div key={index} className="text-center">
                      <Icon className="w-8 h-8 text-[var(--aura-accent-primary)] mx-auto mb-2" />
                      <h3 className="font-semibold mb-2">{item.label}</h3>
                      <p className="text-sm text-[var(--aura-text-secondary)]">{item.value}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </motion.div>

        {/* Executive KPIs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="aura-chart-title mb-4">Executive KPIs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="aura-card">
              <div className="aura-metric-value">{ceoData?.kpis.activeProjects || 0}</div>
              <div className="aura-metric-label">Active Projects</div>
            </div>
            <div className="aura-card">
              <div className="aura-metric-value">${(ceoData?.kpis.pipelineValue || 0) / 1000000}M</div>
              <div className="aura-metric-label">Pipeline Value</div>
            </div>
            <div className="aura-card">
              <div className="aura-metric-value">{ceoData?.kpis.clientHealth || 0}%</div>
              <div className="aura-metric-label">Client Health</div>
            </div>
            <div className="aura-card">
              <div className="aura-metric-value">{ceoData?.kpis.teamCapacity || 0}%</div>
              <div className="aura-metric-label">Team Capacity</div>
            </div>
          </div>
        </motion.div>

        {/* Strategic Task List & Communication Triage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Strategic Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="aura-card"
          >
            <h3 className="aura-chart-title mb-4">Strategic Tasks</h3>
            <div className="space-y-3">
              {ceoData?.tasks.length ? (
                ceoData.tasks.map((task, index) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-[var(--aura-surface-elevated)] rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-[var(--aura-text-primary)]">{task.title}</p>
                      <p className="text-sm text-[var(--aura-text-secondary)]">Due: {task.due}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FlagIcon className="w-12 h-12 text-[var(--aura-text-muted)] mx-auto mb-4" />
                  <p className="text-[var(--aura-text-secondary)] mb-4">No tasks available</p>
                  <button
                    onClick={() => setShowMilestoneSystem(true)}
                    className="aura-btn aura-btn-primary"
                  >
                    Create Your First Milestone
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Communication Triage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="aura-card"
          >
            <h3 className="aura-chart-title mb-4">Communication Triage</h3>
            <div className="space-y-3">
              {ceoData?.communications.length ? (
                ceoData.communications.map((comm, index) => (
                  <div key={comm.id} className="flex items-center justify-between p-3 bg-[var(--aura-surface-elevated)] rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${getUrgencyColor(comm.urgency)}`} />
                        <span className="text-xs text-[var(--aura-text-secondary)]">{comm.type}</span>
                      </div>
                      <p className="font-medium text-[var(--aura-text-primary)]">{comm.title}</p>
                      <p className="text-sm text-[var(--aura-text-secondary)]">From: {comm.from}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-[var(--aura-accent-primary)]">
                        {comm.urgency}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <BellIcon className="w-12 h-12 text-[var(--aura-text-muted)] mx-auto mb-4" />
                  <p className="text-[var(--aura-text-secondary)]">No communications available</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Focus Mode Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <button className="aura-btn aura-btn-primary text-lg px-8 py-4">
            🎯 Start Focus Mode
          </button>
        </motion.div>
      </div>

      <AuraNavigation />
    </div>
  )
}