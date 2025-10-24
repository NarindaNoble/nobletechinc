'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  HomeIcon, 
  BuildingOfficeIcon,
  ClockIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import AuraNavigation from '@/components/AuraNavigation'

export default function AEDCommand() {
  const [location, setLocation] = useState<'HOME' | 'OFFICE'>('HOME')

  const mockKPIs = {
    activeProjects: 12,
    pipelineValue: 2500000,
    clientHealthScore: 94,
    teamCapacity: 78
  }

  const mockTasks = [
    { id: 1, title: 'Review Q4 strategic roadmap', priority: 'CRITICAL', due: 'Today' },
    { id: 2, title: 'Client escalation: Phoenix project', priority: 'HIGH', due: '2 hours' },
    { id: 3, title: 'Board meeting preparation', priority: 'MEDIUM', due: 'Tomorrow' }
  ]

  const mockComms = [
    { id: 1, source: 'EMAIL', sender: 'Sarah Chen (CTO)', subject: 'Phoenix project budget concerns', urgency: 9 },
    { id: 2, source: 'SLACK', sender: 'Engineering Team', subject: 'Production incident resolved', urgency: 6 },
    { id: 3, source: 'EMAIL', sender: 'Legal Team', subject: 'Contract renewal - Acme Corp', urgency: 4 }
  ]

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
                <div className="text-center">
                  <ClockIcon className="w-8 h-8 text-[var(--aura-accent-primary)] mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Virtual Meetings</h3>
                  <p className="text-sm text-[var(--aura-text-secondary)]">3 scheduled today</p>
                </div>
                <div className="text-center">
                  <ChartBarIcon className="w-8 h-8 text-[var(--aura-accent-secondary)] mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Focus Blocks</h3>
                  <p className="text-sm text-[var(--aura-text-secondary)]">2 hours available</p>
                </div>
                <div className="text-center">
                  <CheckCircleIcon className="w-8 h-8 text-[var(--aura-accent-success)] mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Deep Work</h3>
                  <p className="text-sm text-[var(--aura-text-secondary)]">Strategic planning</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="aura-card">
              <h2 className="aura-chart-title mb-4">🏢 Office Mode - Leadership & Collaboration</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <BuildingOfficeIcon className="w-8 h-8 text-[var(--aura-accent-primary)] mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">In-Person Meetings</h3>
                  <p className="text-sm text-[var(--aura-text-secondary)]">Conference Room A - 2:00 PM</p>
                </div>
                <div className="text-center">
                  <ChartBarIcon className="w-8 h-8 text-[var(--aura-accent-secondary)] mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Team Status</h3>
                  <p className="text-sm text-[var(--aura-text-secondary)]">8 team members in office</p>
                </div>
                <div className="text-center">
                  <ExclamationTriangleIcon className="w-8 h-8 text-[var(--aura-accent-warning)] mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Client Alerts</h3>
                  <p className="text-sm text-[var(--aura-text-secondary)]">2 require attention</p>
                </div>
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
              <div className="aura-metric-value">{mockKPIs.activeProjects}</div>
              <div className="aura-metric-label">Active Projects</div>
            </div>
            <div className="aura-card">
              <div className="aura-metric-value">${(mockKPIs.pipelineValue / 1000000).toFixed(1)}M</div>
              <div className="aura-metric-label">Pipeline Value</div>
            </div>
            <div className="aura-card">
              <div className="aura-metric-value">{mockKPIs.clientHealthScore}%</div>
              <div className="aura-metric-label">Client Health</div>
            </div>
            <div className="aura-card">
              <div className="aura-metric-value">{mockKPIs.teamCapacity}%</div>
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
              {mockTasks.map((task, index) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-[var(--aura-surface-elevated)] rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-[var(--aura-text-primary)]">{task.title}</p>
                    <p className="text-sm text-[var(--aura-text-secondary)]">Due: {task.due}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    task.priority === 'CRITICAL' ? 'bg-[var(--aura-accent-danger)] text-white' :
                    task.priority === 'HIGH' ? 'bg-[var(--aura-accent-warning)] text-white' :
                    'bg-[var(--aura-accent-primary)] text-white'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
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
              {mockComms.map((comm, index) => (
                <div key={comm.id} className="flex items-center justify-between p-3 bg-[var(--aura-surface-elevated)] rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${
                        comm.urgency >= 8 ? 'bg-[var(--aura-accent-danger)]' :
                        comm.urgency >= 6 ? 'bg-[var(--aura-accent-warning)]' :
                        'bg-[var(--aura-accent-success)]'
                      }`} />
                      <span className="text-xs text-[var(--aura-text-secondary)]">{comm.source}</span>
                    </div>
                    <p className="font-medium text-[var(--aura-text-primary)]">{comm.subject}</p>
                    <p className="text-sm text-[var(--aura-text-secondary)]">From: {comm.sender}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-[var(--aura-accent-primary)]">
                      Urgency: {comm.urgency}/10
                    </div>
                  </div>
                </div>
              ))}
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
