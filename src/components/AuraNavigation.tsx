'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function AuraNavigation() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="bg-[var(--aura-surface)] border border-[var(--aura-accent-primary)]/20 rounded-lg p-4 shadow-lg">
        <h3 className="text-sm font-medium text-[var(--aura-text-primary)] mb-3">
          Aura Platform
        </h3>
        <div className="space-y-2">
          <Link 
            href="/"
            className="block px-3 py-2 text-sm text-[var(--aura-text-secondary)] hover:text-[var(--aura-text-primary)] hover:bg-[var(--aura-surface-elevated)] rounded transition-colors"
          >
            🏠 Marketing Site
          </Link>
          <Link 
            href="/ali/dashboard"
            className="block px-3 py-2 text-sm text-[var(--aura-text-secondary)] hover:text-[var(--aura-text-primary)] hover:bg-[var(--aura-surface-elevated)] rounded transition-colors"
          >
            📊 ALI Dashboard
          </Link>
          <Link 
            href="/aed/command"
            className="block px-3 py-2 text-sm text-[var(--aura-text-secondary)] hover:text-[var(--aura-text-primary)] hover:bg-[var(--aura-surface-elevated)] rounded transition-colors"
          >
            🎯 AED Command
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
