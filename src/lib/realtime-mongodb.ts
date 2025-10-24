import React from 'react'
import { getDatabase } from './mongodb'
import { ObjectId } from 'mongodb'

// Real-time data synchronization with MongoDB
export class RealtimeMongoDB {
  private db: any
  private subscriptions: Map<string, Set<(data: any) => void>> = new Map()
  private changeStreams: Map<string, any> = new Map()

  constructor() {
    this.initializeDatabase()
  }

  private async initializeDatabase() {
    this.db = await getDatabase()
  }

  // Subscribe to real-time changes for a specific collection
  async subscribeToCollection(
    collectionName: string,
    filter: any = {},
    callback: (data: any) => void
  ) {
    if (!this.subscriptions.has(collectionName)) {
      this.subscriptions.set(collectionName, new Set())
    }
    
    this.subscriptions.get(collectionName)!.add(callback)

    // Start change stream if not already running
    if (!this.changeStreams.has(collectionName)) {
      await this.startChangeStream(collectionName, filter)
    }

    return () => {
      const callbacks = this.subscriptions.get(collectionName)
      if (callbacks) {
        callbacks.delete(callback)
        if (callbacks.size === 0) {
          this.stopChangeStream(collectionName)
        }
      }
    }
  }

  private async startChangeStream(collectionName: string, filter: any) {
    try {
      const collection = this.db.collection(collectionName)
      const changeStream = collection.watch([
        {
          $match: {
            $or: [
              { operationType: 'insert' },
              { operationType: 'update' },
              { operationType: 'delete' },
              { operationType: 'replace' }
            ]
          }
        }
      ])

      changeStream.on('change', (change: any) => {
        this.handleChange(collectionName, change)
      })

      changeStream.on('error', (error: any) => {
        console.error(`Change stream error for ${collectionName}:`, error)
      })

      this.changeStreams.set(collectionName, changeStream)
    } catch (error) {
      console.error(`Failed to start change stream for ${collectionName}:`, error)
    }
  }

  private stopChangeStream(collectionName: string) {
    const changeStream = this.changeStreams.get(collectionName)
    if (changeStream) {
      changeStream.close()
      this.changeStreams.delete(collectionName)
    }
  }

  private handleChange(collectionName: string, change: any) {
    const callbacks = this.subscriptions.get(collectionName)
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(change)
        } catch (error) {
          console.error('Error in change callback:', error)
        }
      })
    }
  }

  // CRUD operations with real-time updates
  async create(collectionName: string, data: any) {
    const collection = this.db.collection(collectionName)
    const result = await collection.insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return result
  }

  async read(collectionName: string, filter: any = {}, options: any = {}) {
    const collection = this.db.collection(collectionName)
    const cursor = collection.find(filter, options)
    return await cursor.toArray()
  }

  async readOne(collectionName: string, filter: any) {
    const collection = this.db.collection(collectionName)
    return await collection.findOne(filter)
  }

  async update(collectionName: string, filter: any, update: any) {
    const collection = this.db.collection(collectionName)
    const result = await collection.updateOne(filter, {
      $set: {
        ...update,
        updatedAt: new Date()
      }
    })
    return result
  }

  async updateMany(collectionName: string, filter: any, update: any) {
    const collection = this.db.collection(collectionName)
    const result = await collection.updateMany(filter, {
      $set: {
        ...update,
        updatedAt: new Date()
      }
    })
    return result
  }

  async delete(collectionName: string, filter: any) {
    const collection = this.db.collection(collectionName)
    const result = await collection.deleteOne(filter)
    return result
  }

  async deleteMany(collectionName: string, filter: any) {
    const collection = this.db.collection(collectionName)
    const result = await collection.deleteMany(filter)
    return result
  }

  // Aggregation with real-time updates
  async aggregate(collectionName: string, pipeline: any[]) {
    const collection = this.db.collection(collectionName)
    return await collection.aggregate(pipeline).toArray()
  }

  // Search with text indexing
  async search(collectionName: string, searchQuery: string, fields: string[] = []) {
    const collection = this.db.collection(collectionName)
    
    // Create text index if it doesn't exist
    try {
      await collection.createIndex({ [fields.join(' ')]: 'text' })
    } catch (error) {
      // Index might already exist
    }

    const searchPipeline = [
      {
        $match: {
          $text: { $search: searchQuery }
        }
      },
      {
        $addFields: {
          score: { $meta: 'textScore' }
        }
      },
      {
        $sort: { score: { $meta: 'textScore' } }
      }
    ]

    return await collection.aggregate(searchPipeline).toArray()
  }

  // Batch operations
  async bulkWrite(collectionName: string, operations: any[]) {
    const collection = this.db.collection(collectionName)
    return await collection.bulkWrite(operations)
  }

  // Data validation
  async validateData(collectionName: string, data: any, schema: any) {
    // Basic validation - can be extended with JSON Schema
    const requiredFields = schema.required || []
    const missingFields = requiredFields.filter((field: string) => !(field in data))
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
    }

    return true
  }

  // Cleanup
  async cleanup() {
    // Close all change streams
    for (const [collectionName, changeStream] of this.changeStreams) {
      changeStream.close()
    }
    this.changeStreams.clear()
    this.subscriptions.clear()
  }
}

// Singleton instance
export const realtimeDB = new RealtimeMongoDB()

// React hook for real-time data
export function useRealtimeData<T>(
  collectionName: string,
  filter: any = {},
  options: any = {}
) {
  const [data, setData] = React.useState<T[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Initial data load
        const initialData = await realtimeDB.read(collectionName, filter, options)
        setData(initialData)

        // Subscribe to real-time changes
        unsubscribe = await realtimeDB.subscribeToCollection(
          collectionName,
          filter,
          (change) => {
            setData(prevData => {
              switch (change.operationType) {
                case 'insert':
                  return [...prevData, change.fullDocument]
                case 'update':
                  return prevData.map(item => 
                    item._id.toString() === change.documentKey._id.toString()
                      ? { ...item, ...change.updateDescription.updatedFields }
                      : item
                  )
                case 'delete':
                  return prevData.filter(item => 
                    item._id.toString() !== change.documentKey._id.toString()
                  )
                default:
                  return prevData
              }
            })
          }
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    loadData()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [collectionName, JSON.stringify(filter), JSON.stringify(options)])

  return { data, loading, error }
}

// React hook for real-time single document
export function useRealtimeDocument<T>(
  collectionName: string,
  id: string
) {
  const [data, setData] = React.useState<T | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const loadDocument = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Initial document load
        const document = await realtimeDB.readOne(collectionName, { _id: new ObjectId(id) })
        setData(document)

        // Subscribe to real-time changes for this specific document
        unsubscribe = await realtimeDB.subscribeToCollection(
          collectionName,
          { _id: new ObjectId(id) },
          (change) => {
            if (change.operationType === 'update') {
              setData(prevData => prevData ? { ...prevData, ...change.updateDescription.updatedFields } : null)
            } else if (change.operationType === 'delete') {
              setData(null)
            }
          }
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadDocument()
    }

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [collectionName, id])

  return { data, loading, error }
}

// Utility functions for common operations
export const DataOperations = {
  // User management
  async createUser(userData: any) {
    return await realtimeDB.create('users', userData)
  },

  async updateUser(userId: string, updateData: any) {
    return await realtimeDB.update('users', { _id: new ObjectId(userId) }, updateData)
  },

  async getUser(userId: string) {
    return await realtimeDB.readOne('users', { _id: new ObjectId(userId) })
  },

  // Project management
  async createProject(projectData: any) {
    return await realtimeDB.create('projects', projectData)
  },

  async updateProject(projectId: string, updateData: any) {
    return await realtimeDB.update('projects', { _id: new ObjectId(projectId) }, updateData)
  },

  async getProject(projectId: string) {
    return await realtimeDB.readOne('projects', { _id: new ObjectId(projectId) })
  },

  async getUserProjects(userId: string) {
    return await realtimeDB.read('projects', { userId: new ObjectId(userId) })
  },

  // Metrics and analytics
  async createMetric(metricData: any) {
    return await realtimeDB.create('project_metrics', metricData)
  },

  async getProjectMetrics(projectId: string, timeRange?: { start: Date, end: Date }) {
    const filter: any = { projectId: new ObjectId(projectId) }
    if (timeRange) {
      filter.timestamp = { $gte: timeRange.start, $lte: timeRange.end }
    }
    return await realtimeDB.read('project_metrics', filter, { sort: { timestamp: -1 } })
  },

  // Search and filtering
  async searchProjects(query: string, userId: string) {
    return await realtimeDB.search('projects', query, ['name', 'description'])
  },

  async getProjectsByCategory(category: string, userId: string) {
    return await realtimeDB.read('projects', { category, userId: new ObjectId(userId) })
  },

  // Analytics and reporting
  async getProjectAnalytics(projectId: string) {
    const pipeline = [
      { $match: { projectId: new ObjectId(projectId) } },
      {
        $group: {
          _id: '$metricType',
          avgValue: { $avg: '$value' },
          maxValue: { $max: '$value' },
          minValue: { $min: '$value' },
          count: { $sum: 1 }
        }
      }
    ]
    return await realtimeDB.aggregate('project_metrics', pipeline)
  }
}

// Export types for TypeScript
export interface RealtimeDataOptions {
  sort?: Record<string, 1 | -1>
  limit?: number
  skip?: number
  projection?: Record<string, 1 | 0>
}

export interface ChangeEvent {
  operationType: 'insert' | 'update' | 'delete' | 'replace'
  documentKey: { _id: ObjectId }
  fullDocument?: any
  updateDescription?: {
    updatedFields: Record<string, any>
    removedFields: string[]
  }
}
