// Mock data for development when MongoDB is not available
export const mockProjects = [
  {
    _id: '507f1f77bcf86cd799439011',
    name: 'Phoenix E-Commerce Platform',
    description: 'Next-generation e-commerce platform with AI recommendations',
    status: 'ACTIVE',
    startDate: new Date('2024-01-15'),
    budget: 500000,
    organizationId: '507f1f77bcf86cd799439012',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export const mockMetrics = [
  {
    _id: '507f1f77bcf86cd799439013',
    projectId: '507f1f77bcf86cd799439011',
    metricType: 'UPTIME_PERCENTAGE',
    value: 99.8,
    unit: '%',
    timestamp: new Date()
  },
  {
    _id: '507f1f77bcf86cd799439014',
    projectId: '507f1f77bcf86cd799439011',
    metricType: 'ERROR_RATE',
    value: 0.2,
    unit: '%',
    timestamp: new Date()
  },
  {
    _id: '507f1f77bcf86cd799439015',
    projectId: '507f1f77bcf86cd799439011',
    metricType: 'CLOUD_SPEND',
    value: 12450,
    unit: 'USD',
    timestamp: new Date()
  }
]

export const mockTickets = [
  {
    _id: '507f1f77bcf86cd799439016',
    projectId: '507f1f77bcf86cd799439011',
    title: 'Payment gateway timeout issue',
    description: 'Users experiencing timeouts during checkout',
    status: 'OPEN',
    priority: 'HIGH',
    component: 'Payment Module',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '507f1f77bcf86cd799439017',
    projectId: '507f1f77bcf86cd799439011',
    title: 'Database connection pool optimization',
    description: 'Optimize connection pool settings for better performance',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    component: 'Database',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export const mockCEOTasks = [
  {
    _id: '507f1f77bcf86cd799439018',
    title: 'Review Q4 strategic roadmap',
    description: 'Finalize strategic initiatives for Q4',
    status: 'PENDING',
    priority: 'CRITICAL',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    userId: '507f1f77bcf86cd799439019',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '507f1f77bcf86cd799439020',
    title: 'Client escalation: Phoenix project',
    description: 'Address budget concerns from Acme Corp',
    status: 'PENDING',
    priority: 'HIGH',
    dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
    userId: '507f1f77bcf86cd799439019',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export const mockCommunications = [
  {
    _id: '507f1f77bcf86cd799439021',
    source: 'EMAIL',
    externalId: 'email_123',
    subject: 'Phoenix project budget concerns',
    content: 'We need to discuss the budget overrun...',
    sender: 'Sarah Chen (CTO)',
    urgency: 9,
    importance: 8,
    status: 'UNREAD',
    suggestedAction: 'Schedule meeting',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '507f1f77bcf86cd799439022',
    source: 'SLACK',
    externalId: 'slack_456',
    subject: 'Production incident resolved',
    content: 'The payment gateway issue has been fixed...',
    sender: 'Engineering Team',
    urgency: 6,
    importance: 5,
    status: 'UNREAD',
    suggestedAction: 'Acknowledge',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]
