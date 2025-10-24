'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HomeIcon,
  ChartBarIcon,
  CogIcon,
  UserGroupIcon,
  DocumentTextIcon,
  MapIcon,
  InboxIcon,
  TruckIcon,
  BellIcon,
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  user?: {
    name: string
    email: string
    avatar?: string
    role: string
  }
}

const navigationItems = [
  {
    name: 'Home',
    href: '/',
    icon: HomeIcon,
    badge: null,
  },
  {
    name: 'Orders',
    href: '/orders',
    icon: DocumentTextIcon,
    badge: null,
  },
  {
    name: 'Documentation',
    href: '/docs',
    icon: DocumentTextIcon,
    badge: null,
  },
  {
    name: 'Map Overview',
    href: '/map',
    icon: MapIcon,
    badge: null,
  },
  {
    name: 'Statistics',
    href: '/stats',
    icon: ChartBarIcon,
    badge: null,
  },
]

const communicationItems = [
  {
    name: 'Inbox',
    href: '/inbox',
    icon: InboxIcon,
    badge: '9+',
  },
  {
    name: 'Couriers',
    href: '/couriers',
    icon: TruckIcon,
    badge: null,
  },
]

const bottomItems = [
  {
    name: 'Settings',
    href: '/settings',
    icon: CogIcon,
  },
  {
    name: 'Help',
    href: '/help',
    icon: DocumentTextIcon,
  },
]

export default function ProfessionalSidebar({ isCollapsed, onToggle, user }: SidebarProps) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 },
  }

  const contentVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -20 },
  }

  return (
    <motion.aside
      className="aura-surface h-full flex flex-col"
      variants={sidebarVariants}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Header */}
      <div className="p-6 border-b border-aura-glass-border">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                key="expanded-logo"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-aura-accent-primary to-aura-accent-secondary rounded-lg flex items-center justify-center">
                  <span className="text-aura-background font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold text-aura-text-primary">Storeify</span>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed-logo"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="w-8 h-8 bg-gradient-to-br from-aura-accent-primary to-aura-accent-secondary rounded-lg flex items-center justify-center mx-auto"
              >
                <span className="text-aura-background font-bold text-sm">S</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={onToggle}
            className="p-1.5 rounded-md hover:bg-aura-surface-elevated transition-colors"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="w-4 h-4 text-aura-text-secondary" />
            ) : (
              <ChevronLeftIcon className="w-4 h-4 text-aura-text-secondary" />
            )}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="expanded-search"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-aura-text-muted" />
              <input
                type="text"
                placeholder="Q Search for anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="aura-input pl-10"
              />
            </motion.div>
          ) : (
            <motion.button
              key="collapsed-search"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full p-2 rounded-md hover:bg-aura-surface-elevated transition-colors flex items-center justify-center"
            >
              <MagnifyingGlassIcon className="w-5 h-5 text-aura-text-secondary" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-4">
        <div className="space-y-1">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                key="main-section"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="mb-4"
              >
                <h3 className="text-xs font-semibold text-aura-text-muted uppercase tracking-wider mb-2">
                  Main
                </h3>
              </motion.div>
            )}
          </AnimatePresence>

          {navigationItems.map((item) => (
            <NavItem
              key={item.name}
              item={item}
              isActive={pathname === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>

        <div className="mt-6 space-y-1">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                key="communication-section"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="mb-4"
              >
                <h3 className="text-xs font-semibold text-aura-text-muted uppercase tracking-wider mb-2">
                  Communication
                </h3>
              </motion.div>
            )}
          </AnimatePresence>

          {communicationItems.map((item) => (
            <NavItem
              key={item.name}
              item={item}
              isActive={pathname === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </div>

      {/* Capacity Card */}
      <div className="px-4 mb-4">
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="expanded-capacity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="aura-card p-4 bg-gradient-to-br from-aura-surface to-aura-surface-elevated"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-aura-text-primary">60% Used capacity</span>
                <button className="text-aura-text-muted hover:text-aura-text-primary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-aura-text-secondary mb-3">
                You are already using 60% of your capacity.
              </p>
              <button className="aura-button aura-button-primary w-full text-sm">
                Upgrade plan
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="collapsed-capacity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full p-2 rounded-md hover:bg-aura-surface-elevated transition-colors flex items-center justify-center"
            >
              <ChartBarIcon className="w-5 h-5 text-aura-text-secondary" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="px-4 space-y-1">
        {bottomItems.map((item) => (
          <NavItem
            key={item.name}
            item={item}
            isActive={pathname === item.href}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-aura-glass-border">
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="expanded-user"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-aura-accent-primary to-aura-accent-secondary rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-aura-background" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-aura-text-primary truncate">
                  {user?.name || 'Full name'}
                </p>
                <p className="text-xs text-aura-text-muted truncate">
                  {user?.email || 'johndoe@gmail.com'}
                </p>
              </div>
              <button className="p-1 rounded-md hover:bg-aura-surface-elevated transition-colors">
                <ChevronRightIcon className="w-4 h-4 text-aura-text-muted" />
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="collapsed-user"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full p-2 rounded-md hover:bg-aura-surface-elevated transition-colors flex items-center justify-center"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-aura-accent-primary to-aura-accent-secondary rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-aura-background" />
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  )
}

interface NavItemProps {
  item: {
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    badge?: string | null
  }
  isActive: boolean
  isCollapsed: boolean
}

function NavItem({ item, isActive, isCollapsed }: NavItemProps) {
  const Icon = item.icon

  return (
    <Link href={item.href}>
      <motion.div
        className={`aura-nav-item ${isActive ? 'active' : ''}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              key="expanded-content"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between flex-1"
            >
              <span>{item.name}</span>
              {item.badge && (
                <span className="aura-badge aura-badge-primary text-xs">
                  {item.badge}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  )
}
