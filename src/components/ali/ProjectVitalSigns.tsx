'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  ChartBarIcon, 
  ExclamationTriangleIcon, 
  CurrencyDollarIcon,
  TicketIcon 
} from '@heroicons/react/24/outline'

interface VitalSignsData {
  projectId: string
  projectName: string
  uptime: number
  errorRate: number
  cloudSpend: number
  openTickets: number
  healthScore: 'HEALTHY' | 'WARNING' | 'CRITICAL'
  trends: {
    uptime: 'UP' | 'DOWN' | 'STABLE'
    errorRate: 'UP' | 'DOWN' | 'STABLE'
    cloudSpend: 'UP' | 'DOWN' | 'STABLE'
  }
}

interface ProjectVitalSignsProps {
  data: VitalSignsData
}

export default function ProjectVitalSigns({ data }: ProjectVitalSignsProps) {
  const getHealthColor = (score: string) => {
    switch (score) {
      case 'HEALTHY': return 'text-[var(--aura-accent-success)]'
      case 'WARNING': return 'text-[var(--aura-accent-warning)]'
      case 'CRITICAL': return 'text-[var(--aura-accent-danger)]'
      default: return 'text-[var(--aura-text-secondary)]'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'UP': return '↗'
      case 'DOWN': return '↘'
      case 'STABLE': return '→'
      default: return '→'
    }
  }

  const getTrendColor = (trend: string, metric: string) => {
    if (trend === 'STABLE') return 'text-[var(--aura-text-secondary)]'
    
    // For uptime and cloud spend, UP is good, DOWN is bad
    // For error rate, DOWN is good, UP is bad
    const isGoodTrend = (metric === 'uptime' || metric === 'cloudSpend') ? trend === 'UP' : trend === 'DOWN'
    
    return isGoodTrend ? 'text-[var(--aura-accent-success)]' : 'text-[var(--aura-accent-danger)]'
  }

  return (
    <div className="aura-card aura-metric-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="aura-chart-title">{data.projectName} - Vital Signs</h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(data.healthScore)}`}>
          {data.healthScore}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Uptime */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="aura-card"
        >
          <div className="flex items-center justify-between mb-2">
            <ChartBarIcon className="w-5 h-5 text-[var(--aura-accent-primary)]" />
            <span className={`text-sm ${getTrendColor(data.trends.uptime, 'uptime')}`}>
              {getTrendIcon(data.trends.uptime)}
            </span>
          </div>
          <div className="aura-metric-value">{data.uptime}%</div>
          <div className="aura-metric-label">Uptime</div>
        </motion.div>

        {/* Error Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="aura-card"
        >
          <div className="flex items-center justify-between mb-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-[var(--aura-accent-danger)]" />
            <span className={`text-sm ${getTrendColor(data.trends.errorRate, 'errorRate')}`}>
              {getTrendIcon(data.trends.errorRate)}
            </span>
          </div>
          <div className="aura-metric-value">{data.errorRate}%</div>
          <div className="aura-metric-label">Error Rate</div>
        </motion.div>

        {/* Cloud Spend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="aura-card"
        >
          <div className="flex items-center justify-between mb-2">
            <CurrencyDollarIcon className="w-5 h-5 text-[var(--aura-accent-warning)]" />
            <span className={`text-sm ${getTrendColor(data.trends.cloudSpend, 'cloudSpend')}`}>
              {getTrendIcon(data.trends.cloudSpend)}
            </span>
          </div>
          <div className="aura-metric-value">${data.cloudSpend.toLocaleString()}</div>
          <div className="aura-metric-label">Cloud Spend (MTD)</div>
        </motion.div>

        {/* Open Tickets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="aura-card"
        >
          <div className="flex items-center justify-between mb-2">
            <TicketIcon className="w-5 h-5 text-[var(--aura-accent-secondary)]" />
            <span className="text-sm text-[var(--aura-text-secondary)]">
              →
            </span>
          </div>
          <div className="aura-metric-value">{data.openTickets}</div>
          <div className="aura-metric-label">Open Tickets</div>
        </motion.div>
      </div>

      {/* Health Status Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 rounded-lg"
        style={{
          backgroundColor: data.healthScore === 'HEALTHY' 
            ? 'rgba(0, 255, 159, 0.1)' 
            : data.healthScore === 'WARNING'
            ? 'rgba(245, 166, 35, 0.1)'
            : 'rgba(255, 0, 110, 0.1)',
          border: `1px solid ${data.healthScore === 'HEALTHY' 
            ? 'rgba(0, 255, 159, 0.3)' 
            : data.healthScore === 'WARNING'
            ? 'rgba(245, 166, 35, 0.3)'
            : 'rgba(255, 0, 110, 0.3)'}`,
        }}
      >
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            data.healthScore === 'HEALTHY' 
              ? 'bg-[var(--aura-accent-success)]' 
              : data.healthScore === 'WARNING'
              ? 'bg-[var(--aura-accent-warning)]'
              : 'bg-[var(--aura-accent-danger)]'
          }`} />
          <span className="text-sm font-medium">
            {data.healthScore === 'HEALTHY' 
              ? 'All systems operational' 
              : data.healthScore === 'WARNING'
              ? 'Minor issues detected'
              : 'Critical issues require attention'
            }
          </span>
        </div>
      </motion.div>
    </div>
  )
}
