'use client'

import React from 'react'
import { motion } from 'framer-motion'
import ProjectVitalSigns from '@/components/ali/ProjectVitalSigns'
import AuraNavigation from '@/components/AuraNavigation'

// Mock data for demonstration
const mockVitalSigns = {
  projectId: 'proj-1',
  projectName: 'Phoenix E-Commerce Platform',
  uptime: 99.8,
  errorRate: 0.2,
  cloudSpend: 12450,
  openTickets: 3,
  healthScore: 'HEALTHY' as const,
  trends: {
    uptime: 'STABLE' as const,
    errorRate: 'DOWN' as const,
    cloudSpend: 'UP' as const,
  }
}

export default function ALIDashboard() {
  return (
    <div className="min-h-screen aura-theme aura-tech-grid">
      {/* ALI Navigation Header */}
      <nav className="bg-[var(--aura-surface)] border-b border-[var(--aura-accent-primary)]/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[var(--aura-accent-primary)] to-[var(--aura-accent-secondary)] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-[var(--aura-text-primary)]">Aura Lifecycle Intelligence</h1>
                <p className="text-sm text-[var(--aura-text-secondary)]">Project Health Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-[var(--aura-text-secondary)]">
                Welcome back, <span className="text-[var(--aura-accent-primary)]">Claire</span>
              </div>
              <div className="w-8 h-8 bg-[var(--aura-accent-primary)] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">C</span>
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
          <h1 className="text-4xl font-bold text-[var(--aura-text-primary)] mb-2">
            Aura Lifecycle Intelligence
          </h1>
          <p className="text-[var(--aura-text-secondary)]">
            Real-time project health monitoring and predictive analytics
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-[var(--aura-surface)] p-1 rounded-lg w-fit">
            <button className="px-4 py-2 rounded-md bg-[var(--aura-accent-primary)] text-[var(--aura-text-inverse)] font-medium">
              Dashboard
            </button>
            <button className="px-4 py-2 rounded-md text-[var(--aura-text-secondary)] hover:text-[var(--aura-text-primary)] transition-colors">
              Analytics
            </button>
            <button className="px-4 py-2 rounded-md text-[var(--aura-text-secondary)] hover:text-[var(--aura-text-primary)] transition-colors">
              Decommission
            </button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Project Vital Signs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ProjectVitalSigns data={mockVitalSigns} />
          </motion.div>

          {/* Additional Dashboard Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Cost Explorer Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="aura-card"
            >
              <h3 className="aura-chart-title mb-4">Cost Explorer</h3>
              <div className="h-64 flex items-center justify-center text-[var(--aura-text-muted)]">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[var(--aura-surface-elevated)] rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <p>Cost breakdown chart will be displayed here</p>
                </div>
              </div>
            </motion.div>

            {/* Timeline Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="aura-card"
            >
              <h3 className="aura-chart-title mb-4">Project Timeline</h3>
              <div className="h-64 flex items-center justify-center text-[var(--aura-text-muted)]">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[var(--aura-surface-elevated)] rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📅</span>
                  </div>
                  <p>Deployment timeline will be displayed here</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Predictive Analytics Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="aura-card"
          >
            <h3 className="aura-chart-title mb-4">Predictive Analytics</h3>
            <div className="h-64 flex items-center justify-center text-[var(--aura-text-muted)]">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-[var(--aura-surface-elevated)] rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🔮</span>
                </div>
                <p>TCO forecasts and risk predictions will be displayed here</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AuraNavigation />
    </div>
  )
}
