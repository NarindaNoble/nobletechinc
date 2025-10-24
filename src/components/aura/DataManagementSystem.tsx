'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FolderIcon,
  DocumentIcon,
  ArchiveBoxIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  TagIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  StarIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  ShareIcon,
} from '@heroicons/react/24/outline'

interface DataItem {
  id: string
  title: string
  type: 'project' | 'area' | 'resource' | 'archive'
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  author: string
  status: 'active' | 'completed' | 'archived'
  priority: 'low' | 'medium' | 'high' | 'critical'
  description?: string
  metadata?: Record<string, any>
}

interface DataManagementSystemProps {
  userId: string
  onDataChange?: (data: DataItem[]) => void
}

export default function DataManagementSystem({ userId, onDataChange }: DataManagementSystemProps) {
  const [activeTab, setActiveTab] = useState<'projects' | 'areas' | 'resources' | 'archive'>('projects')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [data, setData] = useState<DataItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load data from MongoDB
  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // This would connect to MongoDB and fetch user's data
      const response = await fetch(`/api/data/${userId}`)
      const userData = await response.json()
      setData(userData)
      onDataChange?.(userData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredData = data.filter(item => {
    const matchesTab = item.type === activeTab || (activeTab === 'projects' && item.type === 'project')
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    
    return matchesTab && matchesSearch && matchesCategory
  })

  const categories = ['all', ...Array.from(new Set(data.map(item => item.category)))]

  const tabs = [
    { id: 'projects', label: 'Projects', icon: FolderIcon, count: data.filter(d => d.type === 'project').length },
    { id: 'areas', label: 'Areas', icon: DocumentIcon, count: data.filter(d => d.type === 'area').length },
    { id: 'resources', label: 'Resources', icon: TagIcon, count: data.filter(d => d.type === 'resource').length },
    { id: 'archive', label: 'Archive', icon: ArchiveBoxIcon, count: data.filter(d => d.type === 'archive').length },
  ]

  return (
    <div className="aura-bg min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-aura-text-primary mb-2">
            Data Management System
          </h1>
          <p className="text-aura-text-secondary">
            Organize your ideas with the PARA method - Projects, Areas, Resources, Archive
          </p>
        </div>

        {/* Search and Filters */}
        <div className="aura-card mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-aura-text-muted" />
              <input
                type="text"
                placeholder="Search for anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="aura-input pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="aura-input w-full lg:w-48"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            <button className="aura-button aura-button-primary flex items-center gap-2">
              <PlusIcon className="w-4 h-4" />
              Add Item
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => {
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
                <span className="aura-badge aura-badge-secondary">
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full flex items-center justify-center py-12"
              >
                <div className="aura-loading">
                  <div className="aura-spinner"></div>
                  Loading your data...
                </div>
              </motion.div>
            ) : filteredData.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full"
              >
                <EmptyState activeTab={activeTab} />
              </motion.div>
            ) : (
              filteredData.map((item) => (
                <DataItemCard key={item.id} item={item} onUpdate={loadData} />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

interface DataItemCardProps {
  item: DataItem
  onUpdate: () => void
}

function DataItemCard({ item, onUpdate }: DataItemCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'aura-status-danger'
      case 'high': return 'aura-status-warning'
      case 'medium': return 'aura-status-info'
      case 'low': return 'aura-status-success'
      default: return 'aura-status-info'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project': return FolderIcon
      case 'area': return DocumentIcon
      case 'resource': return TagIcon
      case 'archive': return ArchiveBoxIcon
      default: return DocumentIcon
    }
  }

  const TypeIcon = getTypeIcon(item.type)

  return (
    <motion.div
      className="aura-card aura-card-interactive"
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-aura-surface-elevated">
            <TypeIcon className="w-5 h-5 text-aura-accent-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-aura-text-primary">{item.title}</h3>
            <p className="text-sm text-aura-text-muted">{item.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className={`aura-status ${getPriorityColor(item.priority)}`}>
            {item.priority}
          </span>
        </div>
      </div>

      {item.description && (
        <p className="text-sm text-aura-text-secondary mb-3 line-clamp-2">
          {item.description}
        </p>
      )}

      <div className="flex flex-wrap gap-1 mb-3">
        {item.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="aura-badge aura-badge-secondary text-xs">
            {tag}
          </span>
        ))}
        {item.tags.length > 3 && (
          <span className="aura-badge aura-badge-secondary text-xs">
            +{item.tags.length - 3}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-aura-text-muted mb-3">
        <div className="flex items-center gap-1">
          <UserIcon className="w-3 h-3" />
          {item.author}
        </div>
        <div className="flex items-center gap-1">
          <CalendarIcon className="w-3 h-3" />
          {new Date(item.updatedAt).toLocaleDateString()}
        </div>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center justify-between pt-3 border-t border-aura-glass-border"
          >
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded-md hover:bg-aura-surface-elevated transition-colors">
                <EyeIcon className="w-4 h-4 text-aura-text-secondary" />
              </button>
              <button className="p-1.5 rounded-md hover:bg-aura-surface-elevated transition-colors">
                <PencilIcon className="w-4 h-4 text-aura-text-secondary" />
              </button>
              <button className="p-1.5 rounded-md hover:bg-aura-surface-elevated transition-colors">
                <ShareIcon className="w-4 h-4 text-aura-text-secondary" />
              </button>
            </div>
            <button className="p-1.5 rounded-md hover:bg-aura-surface-elevated transition-colors text-aura-status-danger">
              <TrashIcon className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

interface EmptyStateProps {
  activeTab: string
}

function EmptyState({ activeTab }: EmptyStateProps) {
  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'projects':
        return {
          title: 'No Projects Yet',
          description: 'Create your first project to get started with organized task management.',
          action: 'Create Project'
        }
      case 'areas':
        return {
          title: 'No Areas Defined',
          description: 'Set up areas of responsibility that need ongoing maintenance.',
          action: 'Create Area'
        }
      case 'resources':
        return {
          title: 'No Resources Collected',
          description: 'Start collecting resources like articles, courses, and reference materials.',
          action: 'Add Resource'
        }
      case 'archive':
        return {
          title: 'Archive is Empty',
          description: 'Completed projects and outdated resources will appear here.',
          action: 'View Archive'
        }
      default:
        return {
          title: 'No Data Found',
          description: 'Start organizing your information with the PARA method.',
          action: 'Get Started'
        }
    }
  }

  const message = getEmptyMessage()

  return (
    <div className="aura-empty">
      <div className="aura-empty-icon">
        <FolderIcon className="w-full h-full text-aura-text-muted" />
      </div>
      <h3 className="aura-empty-title">{message.title}</h3>
      <p className="aura-empty-description">{message.description}</p>
      <button className="aura-button aura-button-primary">
        {message.action}
      </button>
    </div>
  )
}
