'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UserIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  KeyIcon,
  BellIcon,
  CogIcon,
  TrashIcon,
  PencilIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import { useRealtimeData } from '@/lib/realtime-mongodb'

interface User {
  _id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'ceo' | 'client'
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  avatar?: string
  createdAt: Date
  lastLogin?: Date
  permissions: string[]
  organizationId?: string
  metadata?: Record<string, any>
}

interface UserManagementSystemProps {
  currentUser: User
  onUserUpdate?: (user: User) => void
}

export default function UserManagementSystem({ currentUser, onUserUpdate }: UserManagementSystemProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  // Real-time data from MongoDB
  const { data: users, loading, error } = useRealtimeData<User>('users')

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleCreateUser = async (userData: any) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      
      if (response.ok) {
        setShowCreateModal(false)
        onUserUpdate?.(userData)
      }
    } catch (error) {
      console.error('Failed to create user:', error)
    }
  }

  const handleUpdateUser = async (userId: string, updateData: any) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })
      
      if (response.ok) {
        setEditingUser(null)
        onUserUpdate?.(updateData)
      }
    } catch (error) {
      console.error('Failed to update user:', error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setShowDeleteConfirm(null)
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ceo': return 'aura-status-danger'
      case 'admin': return 'aura-status-warning'
      case 'client': return 'aura-status-info'
      case 'user': return 'aura-status-success'
      default: return 'aura-status-info'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'aura-status-success'
      case 'inactive': return 'aura-status-warning'
      case 'pending': return 'aura-status-info'
      case 'suspended': return 'aura-status-danger'
      default: return 'aura-status-info'
    }
  }

  if (loading) {
    return (
      <div className="aura-bg min-h-screen flex items-center justify-center">
        <div className="aura-loading">
          <div className="aura-spinner"></div>
          Loading users...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="aura-bg min-h-screen flex items-center justify-center">
        <div className="aura-empty">
          <ExclamationTriangleIcon className="aura-empty-icon text-aura-status-danger" />
          <h3 className="aura-empty-title">Error Loading Users</h3>
          <p className="aura-empty-description">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="aura-bg min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-aura-text-primary mb-2">
                User Management
              </h1>
              <p className="text-aura-text-secondary">
                Manage users, roles, and permissions across the platform
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="aura-button aura-button-primary flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="aura-card mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-aura-text-muted" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="aura-input pl-10"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="aura-input w-full lg:w-48"
            >
              <option value="all">All Roles</option>
              <option value="ceo">CEO</option>
              <option value="admin">Admin</option>
              <option value="client">Client</option>
              <option value="user">User</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="aura-input w-full lg:w-48"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="aura-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="aura-table w-full">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredUsers.map((user) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-aura-accent-primary to-aura-accent-secondary rounded-full flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-aura-background" />
                          </div>
                          <div>
                            <p className="font-medium text-aura-text-primary">{user.name}</p>
                            <p className="text-sm text-aura-text-muted">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`aura-status ${getRoleColor(user.role)}`}>
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className={`aura-status ${getStatusColor(user.status)}`}>
                          {user.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className="text-sm text-aura-text-secondary">
                          {user.lastLogin 
                            ? new Date(user.lastLogin).toLocaleDateString()
                            : 'Never'
                          }
                        </span>
                      </td>
                      <td>
                        <span className="text-sm text-aura-text-secondary">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="p-1.5 rounded-md hover:bg-aura-surface-elevated transition-colors"
                          >
                            <PencilIcon className="w-4 h-4 text-aura-text-secondary" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(user._id)}
                            className="p-1.5 rounded-md hover:bg-aura-surface-elevated transition-colors text-aura-status-danger"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Create User Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <CreateUserModal
              onClose={() => setShowCreateModal(false)}
              onSubmit={handleCreateUser}
            />
          )}
        </AnimatePresence>

        {/* Edit User Modal */}
        <AnimatePresence>
          {editingUser && (
            <EditUserModal
              user={editingUser}
              onClose={() => setEditingUser(null)}
              onSubmit={(updateData) => handleUpdateUser(editingUser._id, updateData)}
            />
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <DeleteConfirmModal
              userId={showDeleteConfirm}
              userName={users.find(u => u._id === showDeleteConfirm)?.name || ''}
              onClose={() => setShowDeleteConfirm(null)}
              onConfirm={() => handleDeleteUser(showDeleteConfirm)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Create User Modal Component
interface CreateUserModalProps {
  onClose: () => void
  onSubmit: (userData: any) => void
}

function CreateUserModal({ onClose, onSubmit }: CreateUserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    status: 'active',
    permissions: [] as string[]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
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
          <h2 className="text-xl font-bold text-aura-text-primary">Create New User</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-aura-surface-elevated transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-aura-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="aura-form-group">
            <label className="aura-form-label">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="aura-input"
              required
            />
          </div>

          <div className="aura-form-group">
            <label className="aura-form-label">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="aura-input"
              required
            />
          </div>

          <div className="aura-form-group">
            <label className="aura-form-label">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="aura-input"
            >
              <option value="user">User</option>
              <option value="client">Client</option>
              <option value="admin">Admin</option>
              <option value="ceo">CEO</option>
            </select>
          </div>

          <div className="aura-form-group">
            <label className="aura-form-label">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="aura-input"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
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
              Create User
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// Edit User Modal Component
interface EditUserModalProps {
  user: User
  onClose: () => void
  onSubmit: (updateData: any) => void
}

function EditUserModal({ user, onClose, onSubmit }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    permissions: user.permissions
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
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
          <h2 className="text-xl font-bold text-aura-text-primary">Edit User</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-aura-surface-elevated transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-aura-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="aura-form-group">
            <label className="aura-form-label">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="aura-input"
              required
            />
          </div>

          <div className="aura-form-group">
            <label className="aura-form-label">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="aura-input"
              required
            />
          </div>

          <div className="aura-form-group">
            <label className="aura-form-label">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="aura-input"
            >
              <option value="user">User</option>
              <option value="client">Client</option>
              <option value="admin">Admin</option>
              <option value="ceo">CEO</option>
            </select>
          </div>

          <div className="aura-form-group">
            <label className="aura-form-label">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="aura-input"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
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
              Update User
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// Delete Confirmation Modal Component
interface DeleteConfirmModalProps {
  userId: string
  userName: string
  onClose: () => void
  onConfirm: () => void
}

function DeleteConfirmModal({ userName, onClose, onConfirm }: DeleteConfirmModalProps) {
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
        <div className="text-center">
          <div className="w-16 h-16 bg-aura-status-danger bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon className="w-8 h-8 text-aura-status-danger" />
          </div>
          <h2 className="text-xl font-bold text-aura-text-primary mb-2">
            Delete User
          </h2>
          <p className="text-aura-text-secondary mb-6">
            Are you sure you want to delete <strong>{userName}</strong>? This action cannot be undone.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onClose}
              className="aura-button aura-button-ghost"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="aura-button bg-aura-status-danger hover:bg-red-600 text-white"
            >
              Delete User
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
