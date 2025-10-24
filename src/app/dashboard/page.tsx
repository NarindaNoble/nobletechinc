'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ProfessionalSidebar from '@/components/aura/ProfessionalSidebar'
import DataManagementSystem from '@/components/aura/DataManagementSystem'
import UserManagementSystem from '@/components/aura/UserManagementSystem'
import { useRealtimeData } from '@/lib/realtime-mongodb'

interface DashboardProps {
  user: {
    id: string
    name: string
    email: string
    role: string
    avatar?: string
  }
}

export default function Dashboard({ user }: DashboardProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeView, setActiveView] = useState<'overview' | 'data' | 'users' | 'analytics'>('overview')

  // Real-time data for overview
  const { data: projects, loading: projectsLoading } = useRealtimeData('projects')
  const { data: users, loading: usersLoading } = useRealtimeData('users')
  const { data: metrics, loading: metricsLoading } = useRealtimeData('project_metrics')

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const renderContent = () => {
    switch (activeView) {
      case 'data':
        return <DataManagementSystem userId={user.id} />
      case 'users':
        return <UserManagementSystem currentUser={user} />
      case 'analytics':
        return <AnalyticsView />
      default:
        return <OverviewView 
          projects={projects} 
          users={users} 
          metrics={metrics}
          loading={{ projects: projectsLoading, users: usersLoading, metrics: metricsLoading }}
        />
    }
  }

  return (
    <div className="aura-bg min-h-screen flex">
      <ProfessionalSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
        user={user}
      />
      
      <main className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header */}
          <header className="aura-surface border-b border-aura-glass-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-aura-text-primary">
                  {activeView === 'overview' && 'Dashboard Overview'}
                  {activeView === 'data' && 'Data Management'}
                  {activeView === 'users' && 'User Management'}
                  {activeView === 'analytics' && 'Analytics'}
                </h1>
                <p className="text-aura-text-secondary">
                  {activeView === 'overview' && 'Real-time overview of your platform'}
                  {activeView === 'data' && 'Organize your data with the PARA method'}
                  {activeView === 'users' && 'Manage users, roles, and permissions'}
                  {activeView === 'analytics' && 'Advanced analytics and insights'}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-aura-status-success rounded-full animate-pulse"></div>
                  <span className="text-sm text-aura-text-secondary">Live</span>
                </div>
                <div className="text-sm text-aura-text-muted">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </header>

          {/* Navigation Tabs */}
          <nav className="aura-surface border-b border-aura-glass-border px-4">
            <div className="flex items-center gap-1">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'data', label: 'Data' },
                { id: 'users', label: 'Users' },
                { id: 'analytics', label: 'Analytics' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as any)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeView === tab.id
                      ? 'aura-button-primary'
                      : 'aura-button-ghost'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  )
}

// Overview View Component
interface OverviewViewProps {
  projects: any[]
  users: any[]
  metrics: any[]
  loading: {
    projects: boolean
    users: boolean
    metrics: boolean
  }
}

function OverviewView({ projects, users, metrics, loading }: OverviewViewProps) {
  const stats = [
    {
      label: 'Total Projects',
      value: projects.length,
      change: '+12%',
      trend: 'up',
      loading: loading.projects
    },
    {
      label: 'Active Users',
      value: users.filter(u => u.status === 'active').length,
      change: '+8%',
      trend: 'up',
      loading: loading.users
    },
    {
      label: 'Data Points',
      value: metrics.length,
      change: '+24%',
      trend: 'up',
      loading: loading.metrics
    },
    {
      label: 'System Health',
      value: '99.8%',
      change: '+0.2%',
      trend: 'up',
      loading: false
    }
  ]

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="aura-card"
            >
              <div className="aura-metric">
                <div className="aura-metric-label">{stat.label}</div>
                <div className="aura-metric-value">
                  {stat.loading ? (
                    <div className="aura-loading">
                      <div className="aura-spinner"></div>
                    </div>
                  ) : (
                    stat.value
                  )}
                </div>
                <div className={`aura-metric-change ${stat.trend}`}>
                  {stat.change}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="aura-card">
            <h3 className="text-lg font-semibold text-aura-text-primary mb-4">
              Recent Projects
            </h3>
            <div className="space-y-3">
              {projects.slice(0, 5).map((project) => (
                <div key={project._id} className="flex items-center justify-between p-3 rounded-lg bg-aura-surface-elevated">
                  <div>
                    <p className="font-medium text-aura-text-primary">{project.name}</p>
                    <p className="text-sm text-aura-text-muted">{project.status}</p>
                  </div>
                  <span className="aura-badge aura-badge-primary">
                    {project.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="aura-card">
            <h3 className="text-lg font-semibold text-aura-text-primary mb-4">
              System Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-aura-text-secondary">Database</span>
                <span className="aura-status aura-status-success">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-aura-text-secondary">API</span>
                <span className="aura-status aura-status-success">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-aura-text-secondary">Real-time</span>
                <span className="aura-status aura-status-success">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-aura-text-secondary">Storage</span>
                <span className="aura-status aura-status-warning">85% Used</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Analytics View Component
function AnalyticsView() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="aura-card">
          <h3 className="text-lg font-semibold text-aura-text-primary mb-4">
            Analytics Dashboard
          </h3>
          <div className="aura-empty">
            <div className="aura-empty-icon">
              <svg className="w-full h-full text-aura-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="aura-empty-title">Analytics Coming Soon</h3>
            <p className="aura-empty-description">
              Advanced analytics and insights will be available here.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
