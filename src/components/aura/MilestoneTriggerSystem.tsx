'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  BellIcon,
  TargetIcon,
  FlagIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  CogIcon,
} from '@heroicons/react/24/outline'
import { useRealtimeData } from '@/lib/realtime-mongodb'

interface Milestone {
  id: string
  title: string
  description: string
  targetDate: Date
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: 'project' | 'goal' | 'routine' | 'deadline'
  status: 'pending' | 'in-progress' | 'completed' | 'overdue'
  createdAt: Date
  updatedAt: Date
  userId: string
}

interface Trigger {
  id: string
  name: string
  description: string
  condition: {
    type: 'time' | 'milestone' | 'metric' | 'external'
    value: any
    operator: 'equals' | 'greater_than' | 'less_than' | 'contains'
  }
  action: {
    type: 'notification' | 'task_creation' | 'email' | 'slack' | 'calendar'
    config: any
  }
  isActive: boolean
  createdAt: Date
  userId: string
}

interface MilestoneTriggerSystemProps {
  userId: string
  onMilestoneUpdate?: (milestone: Milestone) => void
  onTriggerUpdate?: (trigger: Trigger) => void
}

export default function MilestoneTriggerSystem({ 
  userId, 
  onMilestoneUpdate, 
  onTriggerUpdate 
}: MilestoneTriggerSystemProps) {
  const [activeTab, setActiveTab] = useState<'milestones' | 'triggers' | 'dashboard'>('dashboard')
  const [showMilestoneModal, setShowMilestoneModal] = useState(false)
  const [showTriggerModal, setShowTriggerModal] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null)
  const [editingTrigger, setEditingTrigger] = useState<Trigger | null>(null)

  // Real-time data from MongoDB
  const { data: milestones, loading: milestonesLoading } = useRealtimeData<Milestone>('milestones', { userId })
  const { data: triggers, loading: triggersLoading } = useRealtimeData<Trigger>('triggers', { userId })

  const handleCreateMilestone = async (milestoneData: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(milestoneData)
      })
      
      if (response.ok) {
        setShowMilestoneModal(false)
        onMilestoneUpdate?.(milestoneData as Milestone)
      }
    } catch (error) {
      console.error('Failed to create milestone:', error)
    }
  }

  const handleUpdateMilestone = async (milestoneId: string, updateData: Partial<Milestone>) => {
    try {
      const response = await fetch(`/api/milestones/${milestoneId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })
      
      if (response.ok) {
        setEditingMilestone(null)
        onMilestoneUpdate?.(updateData as Milestone)
      }
    } catch (error) {
      console.error('Failed to update milestone:', error)
    }
  }

  const handleCreateTrigger = async (triggerData: Omit<Trigger, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/triggers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(triggerData)
      })
      
      if (response.ok) {
        setShowTriggerModal(false)
        onTriggerUpdate?.(triggerData as Trigger)
      }
    } catch (error) {
      console.error('Failed to create trigger:', error)
    }
  }

  const handleUpdateTrigger = async (triggerId: string, updateData: Partial<Trigger>) => {
    try {
      const response = await fetch(`/api/triggers/${triggerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })
      
      if (response.ok) {
        setEditingTrigger(null)
        onTriggerUpdate?.(updateData as Trigger)
      }
    } catch (error) {
      console.error('Failed to update trigger:', error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'aura-status-danger'
      case 'high': return 'aura-status-warning'
      case 'medium': return 'aura-status-info'
      case 'low': return 'aura-status-success'
      default: return 'aura-status-info'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'aura-status-success'
      case 'in-progress': return 'aura-status-info'
      case 'overdue': return 'aura-status-danger'
      case 'pending': return 'aura-status-warning'
      default: return 'aura-status-info'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'project': return TargetIcon
      case 'goal': return FlagIcon
      case 'routine': return ClockIcon
      case 'deadline': return CalendarIcon
      default: return TargetIcon
    }
  }

  const upcomingMilestones = milestones
    .filter(m => m.status === 'pending' || m.status === 'in-progress')
    .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
    .slice(0, 5)

  const activeTriggers = triggers.filter(t => t.isActive)

  return (
    <div className="aura-bg min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-aura-text-primary mb-2">
                Milestone & Trigger System
              </h1>
              <p className="text-aura-text-secondary">
                Set milestones, create triggers, and automate your CEO workflow
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMilestoneModal(true)}
                className="aura-button aura-button-primary flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                Add Milestone
              </button>
              <button
                onClick={() => setShowTriggerModal(true)}
                className="aura-button aura-button-secondary flex items-center gap-2"
              >
                <CogIcon className="w-4 h-4" />
                Create Trigger
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 mb-6">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: TargetIcon },
            { id: 'milestones', label: 'Milestones', icon: FlagIcon },
            { id: 'triggers', label: 'Triggers', icon: CogIcon }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`aura-button flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? 'aura-button-primary' 
                    : 'aura-button-ghost'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {activeTab === 'dashboard' && (
            <>
              {/* Overview Stats */}
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="aura-card">
                  <div className="aura-metric">
                    <div className="aura-metric-label">Total Milestones</div>
                    <div className="aura-metric-value">{milestones.length}</div>
                    <div className="aura-metric-change positive">+3 this week</div>
                  </div>
                </div>
                <div className="aura-card">
                  <div className="aura-metric">
                    <div className="aura-metric-label">Active Triggers</div>
                    <div className="aura-metric-value">{activeTriggers.length}</div>
                    <div className="aura-metric-change neutral">Monitoring</div>
                  </div>
                </div>
                <div className="aura-card">
                  <div className="aura-metric">
                    <div className="aura-metric-label">Completed</div>
                    <div className="aura-metric-value">
                      {milestones.filter(m => m.status === 'completed').length}
                    </div>
                    <div className="aura-metric-change positive">This month</div>
                  </div>
                </div>
                <div className="aura-card">
                  <div className="aura-metric">
                    <div className="aura-metric-label">Overdue</div>
                    <div className="aura-metric-value">
                      {milestones.filter(m => m.status === 'overdue').length}
                    </div>
                    <div className="aura-metric-change negative">Needs attention</div>
                  </div>
                </div>
              </div>

              {/* Upcoming Milestones */}
              <div className="lg:col-span-2">
                <div className="aura-card">
                  <h3 className="text-lg font-semibold text-aura-text-primary mb-4">
                    Upcoming Milestones
                  </h3>
                  <div className="space-y-3">
                    {upcomingMilestones.map((milestone) => {
                      const CategoryIcon = getCategoryIcon(milestone.category)
                      return (
                        <div key={milestone.id} className="flex items-center justify-between p-3 rounded-lg bg-aura-surface-elevated">
                          <div className="flex items-center gap-3">
                            <CategoryIcon className="w-5 h-5 text-aura-accent-primary" />
                            <div>
                              <p className="font-medium text-aura-text-primary">{milestone.title}</p>
                              <p className="text-sm text-aura-text-muted">
                                {new Date(milestone.targetDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`aura-status ${getPriorityColor(milestone.priority)}`}>
                              {milestone.priority}
                            </span>
                            <span className={`aura-status ${getStatusColor(milestone.status)}`}>
                              {milestone.status}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Active Triggers */}
              <div className="lg:col-span-1">
                <div className="aura-card">
                  <h3 className="text-lg font-semibold text-aura-text-primary mb-4">
                    Active Triggers
                  </h3>
                  <div className="space-y-3">
                    {activeTriggers.slice(0, 5).map((trigger) => (
                      <div key={trigger.id} className="flex items-center justify-between p-3 rounded-lg bg-aura-surface-elevated">
                        <div>
                          <p className="font-medium text-aura-text-primary">{trigger.name}</p>
                          <p className="text-sm text-aura-text-muted">{trigger.condition.type}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-aura-status-success rounded-full animate-pulse"></div>
                          <span className="text-xs text-aura-text-muted">Active</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'milestones' && (
            <div className="lg:col-span-3">
              <MilestonesList 
                milestones={milestones}
                onEdit={setEditingMilestone}
                onUpdate={handleUpdateMilestone}
                loading={milestonesLoading}
              />
            </div>
          )}

          {activeTab === 'triggers' && (
            <div className="lg:col-span-3">
              <TriggersList 
                triggers={triggers}
                onEdit={setEditingTrigger}
                onUpdate={handleUpdateTrigger}
                loading={triggersLoading}
              />
            </div>
          )}
        </div>

        {/* Modals */}
        <AnimatePresence>
          {showMilestoneModal && (
            <MilestoneModal
              onClose={() => setShowMilestoneModal(false)}
              onSubmit={handleCreateMilestone}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {editingMilestone && (
            <MilestoneModal
              milestone={editingMilestone}
              onClose={() => setEditingMilestone(null)}
              onSubmit={(updateData) => handleUpdateMilestone(editingMilestone.id, updateData)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showTriggerModal && (
            <TriggerModal
              onClose={() => setShowTriggerModal(false)}
              onSubmit={handleCreateTrigger}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {editingTrigger && (
            <TriggerModal
              trigger={editingTrigger}
              onClose={() => setEditingTrigger(null)}
              onSubmit={(updateData) => handleUpdateTrigger(editingTrigger.id, updateData)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Milestones List Component
interface MilestonesListProps {
  milestones: Milestone[]
  onEdit: (milestone: Milestone) => void
  onUpdate: (id: string, updateData: Partial<Milestone>) => void
  loading: boolean
}

function MilestonesList({ milestones, onEdit, onUpdate, loading }: MilestonesListProps) {
  if (loading) {
    return (
      <div className="aura-card flex items-center justify-center py-12">
        <div className="aura-loading">
          <div className="aura-spinner"></div>
          Loading milestones...
        </div>
      </div>
    )
  }

  return (
    <div className="aura-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="aura-table w-full">
          <thead>
            <tr>
              <th>Milestone</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Target Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {milestones.map((milestone) => {
              const CategoryIcon = getCategoryIcon(milestone.category)
              return (
                <motion.tr
                  key={milestone.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <CategoryIcon className="w-5 h-5 text-aura-accent-primary" />
                      <div>
                        <p className="font-medium text-aura-text-primary">{milestone.title}</p>
                        <p className="text-sm text-aura-text-muted">{milestone.description}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="aura-badge aura-badge-primary">
                      {milestone.category}
                    </span>
                  </td>
                  <td>
                    <span className={`aura-status ${getPriorityColor(milestone.priority)}`}>
                      {milestone.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`aura-status ${getStatusColor(milestone.status)}`}>
                      {milestone.status}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm text-aura-text-secondary">
                      {new Date(milestone.targetDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(milestone)}
                        className="p-1.5 rounded-md hover:bg-aura-surface-elevated transition-colors"
                      >
                        <PencilIcon className="w-4 h-4 text-aura-text-secondary" />
                      </button>
                      <button
                        onClick={() => onUpdate(milestone.id, { 
                          status: milestone.status === 'completed' ? 'pending' : 'completed' 
                        })}
                        className="p-1.5 rounded-md hover:bg-aura-surface-elevated transition-colors"
                      >
                        {milestone.status === 'completed' ? (
                          <XCircleIcon className="w-4 h-4 text-aura-text-secondary" />
                        ) : (
                          <CheckCircleIcon className="w-4 h-4 text-aura-status-success" />
                        )}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Triggers List Component
interface TriggersListProps {
  triggers: Trigger[]
  onEdit: (trigger: Trigger) => void
  onUpdate: (id: string, updateData: Partial<Trigger>) => void
  loading: boolean
}

function TriggersList({ triggers, onEdit, onUpdate, loading }: TriggersListProps) {
  if (loading) {
    return (
      <div className="aura-card flex items-center justify-center py-12">
        <div className="aura-loading">
          <div className="aura-spinner"></div>
          Loading triggers...
        </div>
      </div>
    )
  }

  return (
    <div className="aura-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="aura-table w-full">
          <thead>
            <tr>
              <th>Trigger</th>
              <th>Condition</th>
              <th>Action</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {triggers.map((trigger) => (
              <motion.tr
                key={trigger.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <td>
                  <div>
                    <p className="font-medium text-aura-text-primary">{trigger.name}</p>
                    <p className="text-sm text-aura-text-muted">{trigger.description}</p>
                  </div>
                </td>
                <td>
                  <span className="aura-badge aura-badge-secondary">
                    {trigger.condition.type}
                  </span>
                </td>
                <td>
                  <span className="aura-badge aura-badge-primary">
                    {trigger.action.type}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      trigger.isActive ? 'bg-aura-status-success animate-pulse' : 'bg-aura-text-muted'
                    }`}></div>
                    <span className="text-sm text-aura-text-secondary">
                      {trigger.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(trigger)}
                      className="p-1.5 rounded-md hover:bg-aura-surface-elevated transition-colors"
                    >
                      <PencilIcon className="w-4 h-4 text-aura-text-secondary" />
                    </button>
                    <button
                      onClick={() => onUpdate(trigger.id, { isActive: !trigger.isActive })}
                      className="p-1.5 rounded-md hover:bg-aura-surface-elevated transition-colors"
                    >
                      {trigger.isActive ? (
                        <PauseIcon className="w-4 h-4 text-aura-status-warning" />
                      ) : (
                        <PlayIcon className="w-4 h-4 text-aura-status-success" />
                      )}
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Milestone Modal Component
interface MilestoneModalProps {
  milestone?: Milestone
  onClose: () => void
  onSubmit: (milestoneData: any) => void
}

function MilestoneModal({ milestone, onClose, onSubmit }: MilestoneModalProps) {
  const [formData, setFormData] = useState({
    title: milestone?.title || '',
    description: milestone?.description || '',
    targetDate: milestone?.targetDate ? new Date(milestone.targetDate).toISOString().split('T')[0] : '',
    priority: milestone?.priority || 'medium',
    category: milestone?.category || 'project',
    status: milestone?.status || 'pending'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      targetDate: new Date(formData.targetDate),
      userId: 'current-user-id' // This would come from auth context
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="aura-card max-w-md w-full mx-4"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-aura-text-primary">
            {milestone ? 'Edit Milestone' : 'Create Milestone'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-aura-surface-elevated transition-colors"
          >
            <XCircleIcon className="w-5 h-5 text-aura-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="aura-form-group">
            <label className="aura-form-label">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="aura-input"
              required
            />
          </div>

          <div className="aura-form-group">
            <label className="aura-form-label">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="aura-input"
              rows={3}
            />
          </div>

          <div className="aura-form-group">
            <label className="aura-form-label">Target Date</label>
            <input
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              className="aura-input"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="aura-form-group">
              <label className="aura-form-label">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="aura-input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="aura-form-group">
              <label className="aura-form-label">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="aura-input"
              >
                <option value="project">Project</option>
                <option value="goal">Goal</option>
                <option value="routine">Routine</option>
                <option value="deadline">Deadline</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="aura-button aura-button-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="aura-button aura-button-primary"
            >
              {milestone ? 'Update Milestone' : 'Create Milestone'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// Trigger Modal Component
interface TriggerModalProps {
  trigger?: Trigger
  onClose: () => void
  onSubmit: (triggerData: any) => void
}

function TriggerModal({ trigger, onClose, onSubmit }: TriggerModalProps) {
  const [formData, setFormData] = useState({
    name: trigger?.name || '',
    description: trigger?.description || '',
    conditionType: trigger?.condition.type || 'time',
    conditionValue: trigger?.condition.value || '',
    conditionOperator: trigger?.condition.operator || 'equals',
    actionType: trigger?.action.type || 'notification',
    actionConfig: trigger?.action.config || {},
    isActive: trigger?.isActive ?? true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      condition: {
        type: formData.conditionType,
        value: formData.conditionValue,
        operator: formData.conditionOperator
      },
      action: {
        type: formData.actionType,
        config: formData.actionConfig
      },
      userId: 'current-user-id' // This would come from auth context
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="aura-card max-w-lg w-full mx-4"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-aura-text-primary">
            {trigger ? 'Edit Trigger' : 'Create Trigger'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-aura-surface-elevated transition-colors"
          >
            <XCircleIcon className="w-5 h-5 text-aura-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="aura-form-group">
            <label className="aura-form-label">Trigger Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="aura-input"
              required
            />
          </div>

          <div className="aura-form-group">
            <label className="aura-form-label">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="aura-input"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="aura-form-group">
              <label className="aura-form-label">Condition Type</label>
              <select
                value={formData.conditionType}
                onChange={(e) => setFormData({ ...formData, conditionType: e.target.value })}
                className="aura-input"
              >
                <option value="time">Time</option>
                <option value="milestone">Milestone</option>
                <option value="metric">Metric</option>
                <option value="external">External</option>
              </select>
            </div>

            <div className="aura-form-group">
              <label className="aura-form-label">Operator</label>
              <select
                value={formData.conditionOperator}
                onChange={(e) => setFormData({ ...formData, conditionOperator: e.target.value })}
                className="aura-input"
              >
                <option value="equals">Equals</option>
                <option value="greater_than">Greater Than</option>
                <option value="less_than">Less Than</option>
                <option value="contains">Contains</option>
              </select>
            </div>
          </div>

          <div className="aura-form-group">
            <label className="aura-form-label">Condition Value</label>
            <input
              type="text"
              value={formData.conditionValue}
              onChange={(e) => setFormData({ ...formData, conditionValue: e.target.value })}
              className="aura-input"
              placeholder="e.g., 09:00, project_completed, 80%"
            />
          </div>

          <div className="aura-form-group">
            <label className="aura-form-label">Action Type</label>
            <select
              value={formData.actionType}
              onChange={(e) => setFormData({ ...formData, actionType: e.target.value })}
              className="aura-input"
            >
              <option value="notification">Notification</option>
              <option value="task_creation">Create Task</option>
              <option value="email">Send Email</option>
              <option value="slack">Slack Message</option>
              <option value="calendar">Calendar Event</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="aura-checkbox"
            />
            <label htmlFor="isActive" className="aura-form-label">
              Active Trigger
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="aura-button aura-button-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="aura-button aura-button-primary"
            >
              {trigger ? 'Update Trigger' : 'Create Trigger'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// Helper functions
function getPriorityColor(priority: string) {
  switch (priority) {
    case 'critical': return 'aura-status-danger'
    case 'high': return 'aura-status-warning'
    case 'medium': return 'aura-status-info'
    case 'low': return 'aura-status-success'
    default: return 'aura-status-info'
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'completed': return 'aura-status-success'
    case 'in-progress': return 'aura-status-info'
    case 'overdue': return 'aura-status-danger'
    case 'pending': return 'aura-status-warning'
    default: return 'aura-status-info'
  }
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'project': return TargetIcon
    case 'goal': return FlagIcon
    case 'routine': return ClockIcon
    case 'deadline': return CalendarIcon
    default: return TargetIcon
  }
}
